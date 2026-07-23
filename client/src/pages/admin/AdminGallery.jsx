import { useEffect, useState } from 'react';
import { Plus, Trash2, X, Save } from 'lucide-react';
import { galleryAdmin } from '../../api/client';
import { Card, Field, Input, Button, IconButton, Banner, EmptyState } from '../../components/admin/ui';

const empty = () => ({ title: '', imageUrl: '', category: 'Campus', order: 0 });

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setItems(await galleryAdmin.list());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      await galleryAdmin.create(editing);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remove this image?')) return;
    await galleryAdmin.remove(id);
    await load();
  }

  if (editing) {
    return (
      <div className="max-w-xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl text-navy-800">Add Gallery Image</h1>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setEditing(null)}><X size={16} /> Cancel</Button>
            <Button onClick={handleSave} disabled={saving}><Save size={16} /> {saving ? 'Saving…' : 'Save'}</Button>
          </div>
        </div>
        {error && <Banner type="error">{error}</Banner>}
        <Card>
          <div className="space-y-4">
            <Field label="Image URL" hint="Paste a hosted image URL"><Input value={editing.imageUrl} onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })} /></Field>
            <Field label="Title / caption"><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
            <Field label="Category"><Input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} placeholder="Campus, Events, Sports…" /></Field>
            <Field label="Display order"><Input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} /></Field>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-navy-800">Gallery</h1>
        <Button onClick={() => setEditing(empty())}><Plus size={16} /> Add Image</Button>
      </div>
      {loading ? <p className="text-sm text-navy-400">Loading…</p> : items.length === 0 ? (
        <Card><EmptyState text="No gallery images yet." /></Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {items.map((img) => (
            <div key={img._id} className="relative rounded-xl overflow-hidden border border-navy-100 bg-white group">
              <img src={img.imageUrl} alt={img.title} className="w-full h-32 object-cover" onError={(e) => { e.target.style.opacity = 0.2; }} />
              <div className="p-2">
                <p className="text-xs text-navy-600 truncate">{img.title || 'Untitled'}</p>
                <p className="text-[10px] text-navy-400">{img.category}</p>
              </div>
              <IconButton
                variant="danger"
                className="absolute top-2 right-2 bg-white/90"
                onClick={() => handleDelete(img._id)}
              >
                <Trash2 size={14} />
              </IconButton>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
