import { useEffect, useState } from "react";
import { Trash2, Mail, MailOpen } from "lucide-react";
import { messagesAdmin } from "../../api/client";
import { Card, IconButton, EmptyState } from "../../components/admin/Ui";

export default function AdminMessages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setItems(await messagesAdmin.list());
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function markRead(id) {
    await messagesAdmin.markRead(id);
    await load();
  }
  async function remove(id) {
    if (!confirm("Delete this inquiry?")) return;
    await messagesAdmin.remove(id);
    await load();
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-navy-800">
        Contact & Admission Inquiries
      </h1>
      {loading ? (
        <p className="text-sm text-navy-400">Loading…</p>
      ) : items.length === 0 ? (
        <Card>
          <EmptyState text="No inquiries yet." />
        </Card>
      ) : (
        <div className="space-y-2">
          {items.map((m) => (
            <Card key={m._id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-navy-800">{m.name}</h3>
                    {!m.isRead && (
                      <span className="w-2 h-2 rounded-full bg-marigold-400" />
                    )}
                  </div>
                  <p className="text-xs text-navy-400">
                    {m.email} {m.phone && `· ${m.phone}`} · {m.program}
                  </p>
                  <p className="text-sm text-navy-600 mt-1">{m.message}</p>
                  <p className="text-xs text-navy-300 mt-1">
                    {new Date(m.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {!m.isRead && (
                    <IconButton
                      onClick={() => markRead(m._id)}
                      title="Mark as read"
                    >
                      <MailOpen size={16} />
                    </IconButton>
                  )}
                  {m.isRead && (
                    <IconButton disabled title="Read">
                      <Mail size={16} />
                    </IconButton>
                  )}
                  <IconButton variant="danger" onClick={() => remove(m._id)}>
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
