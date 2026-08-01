import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, X, Save, Images } from 'lucide-react';
import { galleryAdmin, resolveImageUrl } from '../../api/client';
import { Card, Field, Input, Textarea, Select, Button, IconButton, Banner, EmptyState } from '../../components/admin/Ui';
import MultiImageUpload from '../../components/admin/MultiImageUpload';

const CATEGORIES = ['Campus', 'Events', 'Academics', 'Sports'];

const empty = () => ({
  title: '',
  description: '',
  category: 'Campus',
  date: new Date().toISOString().slice(0, 10),
  images: [],
  thumbnailId: '',
  order: 0,
  featuredOnHome: false,
});

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setItems(await galleryAdmin.list());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!editing.images || editing.images.length === 0) {
      setError('Add at least one photo before saving.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (isNew) await galleryAdmin.create(editing);
      else await galleryAdmin.update(editing._id, editing);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this whole album? All photos in it will be removed.')) return;
    await galleryAdmin.remove(id);
    await load();
  }

  function thumbFor(event) {
    if (event.thumbnailUrl) return event.thumbnailUrl;
    const match = event.images?.find((img) => String(img._id) === String(event.thumbnailId));
    return (match || event.images?.[0])?.url || '';
  }

  if (editing) {
    return (
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl text-navy-800">{isNew ? 'New Gallery Album' : 'Edit Gallery Album'}</h1>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setEditing(null)}><X size={16} /> Cancel</Button>
            <Button onClick={handleSave} disabled={saving}><Save size={16} /> {saving ? 'Saving…' : 'Save'}</Button>
          </div>
        </div>
        {error && <Banner type="error">{error}</Banner>}
        <Card title="Photos" description="Upload directly from your device. Click the star on a photo to make it the album's cover/thumbnail.">
          <MultiImageUpload
            images={editing.images}
            onChange={(images) => setEditing((prev) => ({ ...prev, images }))}
            thumbnailId={editing.thumbnailId}
           onThumbnailChange={(id) => setEditing((prev) => ({ ...prev, thumbnailId: id }))}
          />
        </Card>
        <Card>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Album title"><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="Annual Tech Hackathon 2026" /></Field>
            <Field label="Category">
              <Select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Date"><Input type="date" value={String(editing.date).slice(0, 10)} onChange={(e) => setEditing({ ...editing, date: e.target.value })} /></Field>
            <Field label="Display order"><Input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} /></Field>
          </div>
          <Field label="Description" className="mt-4">
            <Textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
          </Field>
            <label className="mt-4 flex items-center gap-2 text-sm text-navy-700 cursor-pointer">
              <input
                type="checkbox"
                checked={!!editing.featuredOnHome}
                onChange={(e) => setEditing({ ...editing, featuredOnHome: e.target.checked })}
              />
              Show in "The Swastik Experience" on the home page
            </label>
            <p className="text-xs text-navy-400 mt-1">Up to 4 featured albums show there, using the same "Display order" field above (lowest first).</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-navy-800">Gallery</h1>
          <p className="text-sm text-navy-500 mt-1">Each album can hold multiple photos — pick one as the cover shown on the public grid.</p>
        </div>
        <Button onClick={() => { setEditing(empty()); setIsNew(true); }}><Plus size={16} /> New Album</Button>
      </div>
      {loading ? <p className="text-sm text-navy-400">Loading…</p> : items.length === 0 ? (
        <Card><EmptyState text="No gallery albums yet. Create one to showcase campus photos." /></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((event) => (
            <div key={event._id} className="relative rounded-2xl overflow-hidden border border-navy-100 bg-white group">
              <div className="relative aspect-video bg-navy-50">
                {thumbFor(event) ? (
                  <img src={resolveImageUrl(thumbFor(event))} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-navy-300"><Images size={28} /></div>
                )}
                <span className="absolute top-2 right-2 bg-navy-950/70 text-white text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Images size={11} /> {event.images?.length || 0}
                </span>
                {event.featuredOnHome && (
                <span className="absolute bottom-2 left-2 bg-marigold-400 text-navy-950 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  Featured on Home
                </span>
              )}
              </div>
              <div className="p-3">
                <p className="text-xs text-marigold-600 font-semibold">{event.category}</p>
                <h3 className="font-display text-navy-800 truncate">{event.title}</h3>
                <p className="text-xs text-navy-400">{new Date(event.date).toLocaleDateString()}</p>
              </div>
              <div className="absolute top-2 left-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <IconButton className="bg-white/90" onClick={() => { setEditing(event); setIsNew(false); }}><Pencil size={14} /></IconButton>
                <IconButton variant="danger" className="bg-white/90" onClick={() => handleDelete(event._id)}><Trash2 size={14} /></IconButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
