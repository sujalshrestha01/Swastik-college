import { useEffect, useState } from 'react';
import { Save, Plus, Trash2, Link as LinkIcon } from 'lucide-react';
import { getSettings, updateSettings } from '../../api/client';
import { Card, Field, Input, Textarea, Button, IconButton, Banner } from '../../components/admin/ui';
import { useSettings } from '../../context/SettingsContext';

export default function AdminSettings() {
  const { refresh } = useSettings();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    getSettings().then((s) => {
      setSettings(s);
      setLoading(false);
    });
  }, []);

  function set(key, value) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }
  function setSocial(key, value) {
    setSettings((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, [key]: value } }));
  }
  function setStat(idx, key, value) {
    setSettings((prev) => {
      const stats = [...prev.stats];
      stats[idx] = { ...stats[idx], [key]: value };
      return { ...prev, stats };
    });
  }
  function addStat() {
    setSettings((prev) => ({ ...prev, stats: [...(prev.stats || []), { label: '', value: 0, suffix: '' }] }));
  }
  function removeStat(idx) {
    setSettings((prev) => ({ ...prev, stats: prev.stats.filter((_, i) => i !== idx) }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const updated = await updateSettings(settings);
      setSettings(updated);
      await refresh();
      setMessage({ type: 'success', text: 'Settings saved and live on the site.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  }

  if (loading || !settings) return <p className="text-sm text-navy-400">Loading…</p>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between sticky top-0 bg-paper z-10 py-2">
        <div>
          <h1 className="font-display text-2xl text-navy-800">Site Settings</h1>
          <p className="text-sm text-navy-500 mt-1">Every small detail — social links, contact info, homepage content, footer.</p>
        </div>
        <Button onClick={handleSave} disabled={saving}><Save size={16} /> {saving ? 'Saving…' : 'Save All Changes'}</Button>
      </div>

      {message && <Banner type={message.type}>{message.text}</Banner>}

      <Card title="College identity">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="College name"><Input value={settings.collegeName} onChange={(e) => set('collegeName', e.target.value)} /></Field>
          <Field label="Short name" hint="Used in compact spaces like the navbar"><Input value={settings.collegeShortName} onChange={(e) => set('collegeShortName', e.target.value)} /></Field>
          <Field label="Established year"><Input value={settings.establishedYear} onChange={(e) => set('establishedYear', e.target.value)} /></Field>
          <Field label="Affiliation"><Input value={settings.affiliation} onChange={(e) => set('affiliation', e.target.value)} /></Field>
          <Field label="Logo URL"><Input value={settings.logoUrl} onChange={(e) => set('logoUrl', e.target.value)} /></Field>
        </div>
      </Card>

      <Card title="Homepage hero section">
        <div className="space-y-4">
          <Field label="Headline"><Input value={settings.heroHeadline} onChange={(e) => set('heroHeadline', e.target.value)} /></Field>
          <Field label="Subheadline"><Textarea rows={2} value={settings.heroSubheadline} onChange={(e) => set('heroSubheadline', e.target.value)} /></Field>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Call-to-action text"><Input value={settings.heroCtaText} onChange={(e) => set('heroCtaText', e.target.value)} /></Field>
            <Field label="Call-to-action link"><Input value={settings.heroCtaLink} onChange={(e) => set('heroCtaLink', e.target.value)} /></Field>
          </div>
          <Field label="Hero image URL"><Input value={settings.heroImageUrl} onChange={(e) => set('heroImageUrl', e.target.value)} /></Field>
        </div>
      </Card>

      <Card title="About, mission & vision">
        <div className="space-y-4">
          <Field label="About summary"><Textarea rows={3} value={settings.aboutSummary} onChange={(e) => set('aboutSummary', e.target.value)} /></Field>
          <Field label="Mission statement"><Textarea rows={2} value={settings.missionStatement} onChange={(e) => set('missionStatement', e.target.value)} /></Field>
          <Field label="Vision statement"><Textarea rows={2} value={settings.visionStatement} onChange={(e) => set('visionStatement', e.target.value)} /></Field>
        </div>
      </Card>

      <Card title="Quick stats" description="Shown as animated counters on the homepage" action={<Button variant="secondary" onClick={addStat}><Plus size={16} /> Add stat</Button>}>
        <div className="space-y-2">
          {(settings.stats || []).map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_100px_80px_36px] gap-2">
              <Input placeholder="Label" value={s.label} onChange={(e) => setStat(i, 'label', e.target.value)} />
              <Input type="number" placeholder="Value" value={s.value} onChange={(e) => setStat(i, 'value', Number(e.target.value))} />
              <Input placeholder="Suffix (+)" value={s.suffix} onChange={(e) => setStat(i, 'suffix', e.target.value)} />
              <IconButton variant="danger" onClick={() => removeStat(i)}><Trash2 size={16} /></IconButton>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Contact information">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Address"><Input value={settings.address} onChange={(e) => set('address', e.target.value)} /></Field>
          <Field label="Phone"><Input value={settings.phone} onChange={(e) => set('phone', e.target.value)} /></Field>
          <Field label="Email"><Input value={settings.email} onChange={(e) => set('email', e.target.value)} /></Field>
          <Field label="Office hours"><Input value={settings.officeHours} onChange={(e) => set('officeHours', e.target.value)} /></Field>
          <Field label="Google Maps embed URL" className="md:col-span-2"><Input value={settings.mapEmbedUrl} onChange={(e) => set('mapEmbedUrl', e.target.value)} /></Field>
        </div>
      </Card>

      <Card title="Social media links" description="Update the Facebook, Instagram and other links shown in the footer">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label={<span className="flex items-center gap-1.5"><LinkIcon size={14} /> Facebook</span>}>
            <Input value={settings.socialLinks?.facebook || ''} onChange={(e) => setSocial('facebook', e.target.value)} placeholder="https://facebook.com/yourcollege" />
          </Field>
          <Field label={<span className="flex items-center gap-1.5"><LinkIcon size={14} /> Instagram</span>}>
            <Input value={settings.socialLinks?.instagram || ''} onChange={(e) => setSocial('instagram', e.target.value)} />
          </Field>
          <Field label={<span className="flex items-center gap-1.5"><LinkIcon size={14} /> YouTube</span>}>
            <Input value={settings.socialLinks?.youtube || ''} onChange={(e) => setSocial('youtube', e.target.value)} />
          </Field>
          <Field label={<span className="flex items-center gap-1.5"><LinkIcon size={14} /> LinkedIn</span>}>
            <Input value={settings.socialLinks?.linkedin || ''} onChange={(e) => setSocial('linkedin', e.target.value)} />
          </Field>
          <Field label={<span className="flex items-center gap-1.5"><LinkIcon size={14} /> Twitter / X</span>}>
            <Input value={settings.socialLinks?.twitter || ''} onChange={(e) => setSocial('twitter', e.target.value)} />
          </Field>
          <Field label="TikTok">
            <Input value={settings.socialLinks?.tiktok || ''} onChange={(e) => setSocial('tiktok', e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card title="Announcement bar">
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={settings.announcementBarEnabled} onChange={(e) => set('announcementBarEnabled', e.target.checked)} />
            <span className="text-sm text-navy-700">Show announcement bar at the top of the site</span>
          </label>
          <Field label="Announcement text"><Input value={settings.announcementBarText} onChange={(e) => set('announcementBarText', e.target.value)} /></Field>
        </div>
      </Card>

      <Card title="Footer">
        <Field label="Footer note"><Input value={settings.footerNote} onChange={(e) => set('footerNote', e.target.value)} /></Field>
      </Card>

      <div className="flex justify-end pb-6">
        <Button onClick={handleSave} disabled={saving}><Save size={16} /> {saving ? 'Saving…' : 'Save All Changes'}</Button>
      </div>
    </div>
  );
}
