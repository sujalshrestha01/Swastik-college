import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X, Save } from "lucide-react";
import { testimonialsAdmin } from "../../api/client";
import {
  Card,
  Field,
  Input,
  Textarea,
  Button,
  IconButton,
  Banner,
  EmptyState,
} from "../../components/admin/Ui";
import ImageUpload from "../../components/admin/ImageUpload";

const empty = () => ({ name: "", role: "", quote: "", photoUrl: "", order: 0 });

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setItems(await testimonialsAdmin.list());
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      if (isNew) await testimonialsAdmin.create(editing);
      else await testimonialsAdmin.update(editing._id, editing);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this testimonial?")) return;
    await testimonialsAdmin.remove(id);
    await load();
  }

  if (editing) {
    return (
      <div className="max-w-xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl text-navy-800">
            {isNew ? "New Testimonial" : "Edit Testimonial"}
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
            <Field label="Name">
              <Input
                value={editing.name}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
              />
            </Field>
            <Field label="Role / batch" hint="e.g. BSc. CSIT, Batch 2022">
              <Input
                value={editing.role}
                onChange={(e) =>
                  setEditing({ ...editing, role: e.target.value })
                }
              />
            </Field>
            <Field label="Quote">
              <Textarea
                rows={3}
                value={editing.quote}
                onChange={(e) =>
                  setEditing({ ...editing, quote: e.target.value })
                }
              />
            </Field>
            <Field label="Photo">
              <ImageUpload
                value={editing.photoUrl}
                onChange={(url) => setEditing({ ...editing, photoUrl: url })}
                shape="circle"
              />
            </Field>
            <Field label="Display order">
              <Input
                type="number"
                value={editing.order}
                onChange={(e) =>
                  setEditing({ ...editing, order: Number(e.target.value) })
                }
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
        <h1 className="font-display text-2xl text-navy-800">Testimonials</h1>
        <Button
          onClick={() => {
            setEditing(empty());
            setIsNew(true);
          }}
        >
          <Plus size={16} /> New Testimonial
        </Button>
      </div>
      {loading ? (
        <p className="text-sm text-navy-400">Loading…</p>
      ) : items.length === 0 ? (
        <Card>
          <EmptyState text="No testimonials yet." />
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {items.map((t) => (
            <Card key={t._id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-navy-600 italic">"{t.quote}"</p>
                  <p className="text-sm font-semibold text-navy-800 mt-2">
                    {t.name}
                  </p>
                  <p className="text-xs text-navy-400">{t.role}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <IconButton
                    onClick={() => {
                      setEditing(t);
                      setIsNew(false);
                    }}
                  >
                    <Pencil size={16} />
                  </IconButton>
                  <IconButton
                    variant="danger"
                    onClick={() => handleDelete(t._id)}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
