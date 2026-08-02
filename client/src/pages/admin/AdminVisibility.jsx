import { useEffect, useState } from "react";
import { ChevronDown, Eye, EyeOff, Save } from "lucide-react";
import {
  getVisibilitySchema,
  getSettings,
  updateVisibility,
} from "../../api/client";
import { Button, Banner } from "../../components/admin/Ui";

// Toggle switch matching the rest of the admin UI kit's styling conventions.
function Switch({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
      } ${checked ? "bg-marigold-400" : "bg-navy-200"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function AdminVisibility() {
  const [schema, setSchema] = useState(null);
  const [visibility, setVisibility] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openPages, setOpenPages] = useState({});

  async function load() {
    setLoading(true);
    const [schemaData, settingsData] = await Promise.all([
      getVisibilitySchema(),
      getSettings(),
    ]);
    setSchema(schemaData);
    setVisibility(settingsData?.visibility || {});
    setOpenPages(
      Object.fromEntries(Object.keys(schemaData).map((k) => [k, true])),
    );
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  function setPageEnabled(pageKey, enabled) {
    setVisibility((prev) => ({
      ...prev,
      [pageKey]: {
        ...(prev[pageKey] || {}),
        pageEnabled: enabled,
        sections: prev[pageKey]?.sections || {},
      },
    }));
  }

  function setSectionEnabled(pageKey, sectionKey, enabled) {
    setVisibility((prev) => ({
      ...prev,
      [pageKey]: {
        ...(prev[pageKey] || {}),
        pageEnabled: prev[pageKey]?.pageEnabled !== false,
        sections: { ...(prev[pageKey]?.sections || {}), [sectionKey]: enabled },
      },
    }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await updateVisibility(visibility);
      setSuccess(
        "Visibility settings saved. Changes are live on the site immediately.",
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-navy-400">Loading…</p>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-navy-800">
            Page &amp; Section Visibility
          </h1>
          <p className="text-sm text-navy-500 mt-1">
            Turn any page fully off, or hide individual sections within it —
            changes apply instantly on the live site.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save size={16} /> {saving ? "Saving…" : "Save Changes"}
        </Button>
      </div>

      {error && <Banner type="error">{error}</Banner>}
      {success && <Banner type="success">{success}</Banner>}

      <div className="space-y-3">
        {Object.entries(schema).map(([pageKey, pageDef]) => {
          const pageEnabled = visibility[pageKey]?.pageEnabled !== false;
          const isOpen = openPages[pageKey];
          return (
            <div
              key={pageKey}
              className="bg-white rounded-2xl border border-navy-100 shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between gap-3 px-5 py-4 bg-navy-50/60">
                <button
                  type="button"
                  onClick={() =>
                    setOpenPages((p) => ({ ...p, [pageKey]: !p[pageKey] }))
                  }
                  className="flex items-center gap-2 text-left flex-1 min-w-0"
                >
                  <ChevronDown
                    size={16}
                    className={`shrink-0 transition-transform text-navy-400 ${isOpen ? "rotate-180" : ""}`}
                  />
                  {pageEnabled ? (
                    <Eye size={16} className="text-teal-600 shrink-0" />
                  ) : (
                    <EyeOff size={16} className="text-navy-300 shrink-0" />
                  )}
                  <span
                    className={`font-display truncate ${pageEnabled ? "text-navy-800" : "text-navy-400"}`}
                  >
                    {pageDef.label}
                  </span>
                  {!pageEnabled && (
                    <span className="text-[10px] font-semibold bg-navy-100 text-navy-500 px-2 py-0.5 rounded-full shrink-0">
                      Page hidden
                    </span>
                  )}
                </button>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-navy-500 hidden sm:inline">
                    Whole page
                  </span>
                  <Switch
                    checked={pageEnabled}
                    onChange={(v) => setPageEnabled(pageKey, v)}
                  />
                </div>
              </div>
              {isOpen && (
                <div
                  className={`divide-y divide-navy-50 ${!pageEnabled ? "opacity-50" : ""}`}
                >
                  {Object.entries(pageDef.sections).map(
                    ([sectionKey, sectionLabel]) => {
                      const sectionEnabled =
                        typeof visibility[pageKey]?.sections?.[sectionKey] ===
                        "boolean"
                          ? visibility[pageKey].sections[sectionKey]
                          : true;
                      return (
                        <div
                          key={sectionKey}
                          className="flex items-center justify-between gap-3 px-5 py-3 pl-11"
                        >
                          <span className="text-sm text-navy-700">
                            {sectionLabel}
                          </span>
                          <Switch
                            checked={sectionEnabled}
                            disabled={!pageEnabled}
                            onChange={(v) =>
                              setSectionEnabled(pageKey, sectionKey, v)
                            }
                          />
                        </div>
                      );
                    },
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
