import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, X, Save } from 'lucide-react';
import { eventsAdmin } from '../../api/client';
import { Card, Field, Input, Textarea, Select, Button, IconButton, Banner, EmptyState } from '../../components/admin/ui';

const types = ['Event', 'Workshop', 'Seminar', 'Fest', 'Other'];
const empty = () => ({
  title: '', description: '', date: new Date().toISOString().slice(0, 16), location: 'Main Campus', type: 'Event', isFeatured: false,
});

export default function AdminEvents() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setItems(await eventsAdmin.list());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      if (isNew) await eventsAdmin.create(editing);
      else await eventsAdmin.update(editing._id, editing);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this event?')) return;
    await eventsAdmin.remove(id);
    await load();
  }

  if (editing) {
    return (
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl text-navy-800">{isNew ? 'New Event' : 'Edit Event'}</h1>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setEditing(null)}><X size={16} /> Cancel</Button>
            <Button onClick={handleSave} disabled={saving}><Save size={16} /> {saving ? 'Saving…' : 'Save'}</Button>
          </div>
        </div>
        {error && <Banner type="error">{error}</Banner>}
        <Card>
          <div className="space-y-4">
            <Field label="Title"><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Date & time">
                <Input type="datetime-local" value={String(editing.date).slice(0, 16)} onChange={(e) => setEditing({ ...editing, date: e.target.value })} />
              </Field>
              <Field label="Type">
                <Select value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value })}>
                  {types.map((t) => <option key={t} value={t}>{t}</option>)}
                </Select>
              </Field>
            </div>
            <Field label="Location"><Input value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} /></Field>
            <Field label="Description"><Textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={editing.isFeatured} onChange={(e) => setEditing({ ...editing, isFeatured: e.target.checked })} />
              <span className="text-sm text-navy-700">Feature this event on the homepage</span>
            </label>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-navy-800">Events</h1>
        <Button onClick={() => { setEditing(empty()); setIsNew(true); }}><Plus size={16} /> New Event</Button>
      </div>
      {loading ? <p className="text-sm text-navy-400">Loading…</p> : items.length === 0 ? (
        <Card><EmptyState text="No events yet." /></Card>
      ) : (
        <div className="space-y-2">
          {items.map((ev) => (
            <Card key={ev._id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-navy-800">{ev.title}</h3>
                    {ev.isFeatured && <span className="text-xs bg-marigold-100 text-marigold-600 px-2 py-0.5 rounded-full">Featured</span>}
                  </div>
                  <p className="text-xs text-navy-400 mt-1">{new Date(ev.date).toLocaleString()} · {ev.location} · {ev.type}</p>
                  {ev.description && <p className="text-sm text-navy-500 mt-1">{ev.description}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <IconButton onClick={() => { setEditing(ev); setIsNew(false); }}><Pencil size={16} /></IconButton>
                  <IconButton variant="danger" onClick={() => handleDelete(ev._id)}><Trash2 size={16} /></IconButton>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
