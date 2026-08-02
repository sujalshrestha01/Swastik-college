import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  X,
  Save,
  FileText,
  FileImage,
} from "lucide-react";
import { downloadsAdmin } from "../../api/client";
import {
  Card,
  Field,
  Input,
  Select,
  Button,
  IconButton,
  Banner,
  EmptyState,
} from "../../components/admin/Ui";
import FileUpload from "../../components/admin/FileUpload";

const categories = [
  "Model Question",
  "Past Question",
  "Syllabus",
  "Notice",
  "Form",
  "General",
];
const empty = () => ({ title: "", category: "General", fileUrl: "" });

export default function AdminDownloads() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setItems(await downloadsAdmin.list());
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function handleSave() {
    if (!editing.fileUrl) {
      setError("Please upload a file before saving");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (isNew) await downloadsAdmin.create(editing);
      else await downloadsAdmin.update(editing._id, editing);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this download?")) return;
    await downloadsAdmin.remove(id);
    await load();
  }

  if (editing) {
    return (
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl text-navy-800">
            {isNew ? "New Download" : "Edit Download"}
          </h1>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setEditing(null)}>
              <X size={16} /> Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save size={16} /> {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
        {error && <Banner type="error">{error}</Banner>}
        <Card>
          <div className="space-y-4">
            <Field
              label="Title"
              hint="e.g. 'BCA 3rd Semester Model Question 2081'"
            >
              <Input
                value={editing.title}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value })
                }
              />
            </Field>
            <Field label="Category">
              <Select
                value={editing.category}
                onChange={(e) =>
                  setEditing({ ...editing, category: e.target.value })
                }
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>
            <Field
              label="File"
              hint="Upload a PDF or image — this is what visitors will download"
            >
              <FileUpload
                value={editing.fileUrl}
                onChange={(url) => setEditing({ ...editing, fileUrl: url })}
              />
            </Field>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-navy-800">Downloads</h1>
          <p className="text-sm text-navy-500 mt-1">
            Every file added here shows up in the "Downloads" dropdown in the
            site navbar.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(empty());
            setIsNew(true);
          }}
        >
          <Plus size={16} /> New Download
        </Button>
      </div>
      {loading ? (
        <p className="text-sm text-navy-400">Loading…</p>
      ) : items.length === 0 ? (
        <Card>
          <EmptyState text="No downloads yet — add your first file (e.g. a Model Question PDF)." />
        </Card>
      ) : (
        <div className="space-y-2">
          {items.map((d) => {
            const isPdf = /\.pdf($|\?)/i.test(d.fileUrl || "");
            return (
              <Card key={d._id}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-navy-50 text-navy-500">
                      {isPdf ? <FileText size={18} /> : <FileImage size={18} />}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs uppercase tracking-wide text-marigold-500 font-semibold">
                        {d.category}
                      </span>
                      <h3 className="font-display text-navy-800 truncate">
                        {d.title}
                      </h3>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <IconButton
                      onClick={() => {
                        setEditing(d);
                        setIsNew(false);
                      }}
                    >
                      <Pencil size={16} />
                    </IconButton>
                    <IconButton
                      variant="danger"
                      onClick={() => handleDelete(d._id)}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
