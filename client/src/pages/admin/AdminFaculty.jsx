import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, X, Save } from 'lucide-react';
import { facultyAdmin, resolveImageUrl } from '../../api/client';
import { Card, Field, Input, Textarea, Button, IconButton, Banner, EmptyState } from '../../components/admin/Ui';
import ImageUpload from '../../components/admin/ImageUpload';

const empty = () => ({ name: '', designation: '', department: '', qualification: '', bio: '', photoUrl: '', email: '', order: 0 });

export default function AdminFaculty() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setItems(await facultyAdmin.list());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      if (isNew) await facultyAdmin.create(editing);
      else await facultyAdmin.update(editing._id, editing);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remove this faculty member?')) return;
    await facultyAdmin.remove(id);
    await load();
  }

  if (editing) {
    return (
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl text-navy-800">{isNew ? 'Add Faculty Member' : 'Edit Faculty Member'}</h1>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setEditing(null)}><X size={16} /> Cancel</Button>
            <Button onClick={handleSave} disabled={saving}><Save size={16} /> {saving ? 'Saving…' : 'Save'}</Button>
          </div>
        </div>
        {error && <Banner type="error">{error}</Banner>}
        <Card>
          <Field label="Photo" className="mb-4">
            <ImageUpload
              value={editing.photoUrl}
              onChange={(url) => setEditing({ ...editing, photoUrl: url })}
              shape="circle"
              hint="Square headshot works best"
            />
          </Field>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Full name"><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
            <Field label="Designation"><Input value={editing.designation} onChange={(e) => setEditing({ ...editing, designation: e.target.value })} placeholder="Head of Department" /></Field>
            <Field label="Department"><Input value={editing.department} onChange={(e) => setEditing({ ...editing, department: e.target.value })} /></Field>
            <Field label="Qualification"><Input value={editing.qualification} onChange={(e) => setEditing({ ...editing, qualification: e.target.value })} /></Field>
            <Field label="Email"><Input value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></Field>
            <Field label="Display order"><Input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} /></Field>
          </div>
          <Field label="Short bio" className="mt-4">
            <Textarea rows={3} value={editing.bio} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} />
          </Field>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-navy-800">Faculty</h1>
        <Button onClick={() => { setEditing(empty()); setIsNew(true); }}><Plus size={16} /> Add Faculty Member</Button>
      </div>
      {loading ? <p className="text-sm text-navy-400">Loading…</p> : items.length === 0 ? (
        <Card><EmptyState text="No faculty members yet." /></Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {items.map((f) => (
            <Card key={f._id}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  {f.photoUrl ? (
                    <img src={resolveImageUrl(f.photoUrl)} alt="" className="w-12 h-12 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-navy-100 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <h3 className="font-display text-navy-800">{f.name}</h3>
                    <p className="text-sm text-marigold-600">{f.designation}</p>
                    <p className="text-xs text-navy-400">{f.department} · {f.qualification}</p>
                    {f.bio && <p className="text-sm text-navy-500 mt-1">{f.bio}</p>}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <IconButton onClick={() => { setEditing(f); setIsNew(false); }}><Pencil size={16} /></IconButton>
                  <IconButton variant="danger" onClick={() => handleDelete(f._id)}><Trash2 size={16} /></IconButton>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
