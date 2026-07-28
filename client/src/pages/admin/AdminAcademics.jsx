import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, X, Save, GraduationCap, Sparkles } from 'lucide-react';
import { skillCoursesAdmin, workshopsAdmin, resolveImageUrl } from '../../api/client';
import { Card, Field, Input, Textarea, Select, Button, IconButton, Banner, EmptyState } from '../../components/admin/Ui';
import ImageUpload from '../../components/admin/ImageUpload';

const emptyCourse = () => ({ name: '', logoUrl: '', duration: '', description: '', order: 0 });
const emptyWorkshop = () => ({
  name: '', logoUrl: '', duration: '', startDate: new Date().toISOString().slice(0, 10),
  status: 'Enrollment Open', type: 'Workshop', description: '', highlights: [], enrollUrl: '', isActive: true, order: 0,
});

export default function AdminAcademics() {
  const [tab, setTab] = useState('courses'); // 'courses' | 'workshops'
  const [courses, setCourses] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editingType, setEditingType] = useState(null); // 'course' | 'workshop'
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const [c, w] = await Promise.all([skillCoursesAdmin.list(), workshopsAdmin.list()]);
    setCourses(c);
    setWorkshops(w);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function startEdit(type, item, fresh) {
    setEditingType(type);
    setEditing(item);
    setIsNew(fresh);
    setError('');
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      const api = editingType === 'course' ? skillCoursesAdmin : workshopsAdmin;
      if (isNew) await api.create(editing);
      else await api.update(editing._id, editing);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(type, id) {
    if (!confirm('Delete this item?')) return;
    const api = type === 'course' ? skillCoursesAdmin : workshopsAdmin;
    await api.remove(id);
    await load();
  }

  // ---------- Edit forms ----------
  if (editing && editingType === 'course') {
    return (
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl text-navy-800">{isNew ? 'New Certification Course' : 'Edit Course'}</h1>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setEditing(null)}><X size={16} /> Cancel</Button>
            <Button onClick={handleSave} disabled={saving}><Save size={16} /> {saving ? 'Saving…' : 'Save'}</Button>
          </div>
        </div>
        {error && <Banner type="error">{error}</Banner>}
        <Card>
          <Field label="Logo / icon" className="mb-4">
            <ImageUpload value={editing.logoUrl} onChange={(url) => setEditing({ ...editing, logoUrl: url })} shape="square" hint="A small square logo works best" />
          </Field>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Course name"><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
            <Field label="Duration"><Input value={editing.duration} onChange={(e) => setEditing({ ...editing, duration: e.target.value })} placeholder="4 Weeks" /></Field>
            <Field label="Display order"><Input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} /></Field>
          </div>
          <Field label="Description" className="mt-4">
            <Textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
          </Field>
        </Card>
      </div>
    );
  }

  if (editing && editingType === 'workshop') {
    return (
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl text-navy-800">{isNew ? 'New Live Workshop' : 'Edit Workshop'}</h1>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setEditing(null)}><X size={16} /> Cancel</Button>
            <Button onClick={handleSave} disabled={saving}><Save size={16} /> {saving ? 'Saving…' : 'Save'}</Button>
          </div>
        </div>
        {error && <Banner type="error">{error}</Banner>}
        <Card>
          <Field label="Logo / icon" className="mb-4">
            <ImageUpload value={editing.logoUrl} onChange={(url) => setEditing({ ...editing, logoUrl: url })} shape="square" />
          </Field>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Workshop name"><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
            <Field label="Type"><Input value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value })} placeholder="Hands-on Workshop" /></Field>
            <Field label="Duration"><Input value={editing.duration} onChange={(e) => setEditing({ ...editing, duration: e.target.value })} placeholder="3 Days (Weekend)" /></Field>
            <Field label="Start date"><Input type="date" value={String(editing.startDate).slice(0, 10)} onChange={(e) => setEditing({ ...editing, startDate: e.target.value })} /></Field>
            <Field label="Status">
              <Select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                <option>Enrollment Open</option>
                <option>Filling Fast</option>
                <option>Coming Soon</option>
                <option>Closed</option>
              </Select>
            </Field>
            <Field label="Visible on site">
              <Select value={editing.isActive ? 'true' : 'false'} onChange={(e) => setEditing({ ...editing, isActive: e.target.value === 'true' })}>
                <option value="true">Active</option>
                <option value="false">Hidden</option>
              </Select>
            </Field>
          </div>
          <Field label="Description" className="mt-4">
            <Textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
          </Field>
          <Field label="Agenda highlights (one per line)" className="mt-4">
            <Textarea
              rows={4}
              value={(editing.highlights || []).join('\n')}
              onChange={(e) => setEditing({ ...editing, highlights: e.target.value.split('\n') })}
              placeholder={'Interactive Rebase & Branching\nResolving Merge Conflicts'}
            />
          </Field>
          <Field label="Enrollment link (Google Form or any registration URL)" className="mt-4">
            <Input
              value={editing.enrollUrl}
              onChange={(e) => setEditing({ ...editing, enrollUrl: e.target.value })}
              placeholder="https://forms.google.com/..."
            />
          </Field>
          <p className="text-xs text-navy-400 mt-2">
            This is the link visitors are sent to when they click "Enroll Now" — update it any time a new workshop opens.
          </p>
        </Card>
      </div>
    );
  }

  // ---------- List view ----------
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-navy-800">Non-Credit Courses &amp; Workshops</h1>
        <p className="text-sm text-navy-500 mt-1">Manage the certification courses and live workshops shown on the public Academics page.</p>
      </div>

      <div className="flex gap-2 border-b border-navy-100">
        <button
          onClick={() => setTab('courses')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors flex items-center gap-1.5 ${tab === 'courses' ? 'border-marigold-400 text-navy-800' : 'border-transparent text-navy-400 hover:text-navy-600'}`}
        >
          <GraduationCap size={15} /> Certification Courses
        </button>
        <button
          onClick={() => setTab('workshops')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors flex items-center gap-1.5 ${tab === 'workshops' ? 'border-marigold-400 text-navy-800' : 'border-transparent text-navy-400 hover:text-navy-600'}`}
        >
          <Sparkles size={15} /> Live Workshops
        </button>
      </div>

      {tab === 'courses' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => startEdit('course', emptyCourse(), true)}><Plus size={16} /> New Course</Button>
          </div>
          {loading ? <p className="text-sm text-navy-400">Loading…</p> : courses.length === 0 ? (
            <Card><EmptyState text="No certification courses yet." /></Card>
          ) : (
            <div className="space-y-3">
              {courses.map((c) => (
                <Card key={c._id}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {c.logoUrl && <img src={resolveImageUrl(c.logoUrl)} alt="" className="w-10 h-10 rounded-lg object-contain bg-navy-50 shrink-0" />}
                      <div className="min-w-0">
                        <h3 className="font-display text-navy-800 truncate">{c.name}</h3>
                        <p className="text-xs text-navy-400">{c.duration}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <IconButton onClick={() => startEdit('course', c, false)}><Pencil size={16} /></IconButton>
                      <IconButton variant="danger" onClick={() => handleDelete('course', c._id)}><Trash2 size={16} /></IconButton>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'workshops' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => startEdit('workshop', emptyWorkshop(), true)}><Plus size={16} /> New Workshop</Button>
          </div>
          {loading ? <p className="text-sm text-navy-400">Loading…</p> : workshops.length === 0 ? (
            <Card><EmptyState text="No workshops yet." /></Card>
          ) : (
            <div className="space-y-3">
              {workshops.map((w) => (
                <Card key={w._id}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {w.logoUrl && <img src={resolveImageUrl(w.logoUrl)} alt="" className="w-10 h-10 rounded-lg object-contain bg-navy-50 shrink-0" />}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-navy-800 truncate">{w.name}</h3>
                          {!w.isActive && <span className="text-[10px] font-semibold bg-navy-100 text-navy-500 px-2 py-0.5 rounded-full">Hidden</span>}
                        </div>
                        <p className="text-xs text-navy-400">{w.duration} · {w.status}</p>
                        {!w.enrollUrl && <p className="text-xs text-amber-600 mt-0.5">No enrollment link set yet</p>}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <IconButton onClick={() => startEdit('workshop', w, false)}><Pencil size={16} /></IconButton>
                      <IconButton variant="danger" onClick={() => handleDelete('workshop', w._id)}><Trash2 size={16} /></IconButton>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
