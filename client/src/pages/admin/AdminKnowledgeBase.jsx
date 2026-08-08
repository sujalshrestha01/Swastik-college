import { useCallback, useEffect, useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import {
  getKnowledgeDocs,
  uploadKnowledgePdf,
  deleteKnowledgeDoc,
} from "../../api/client";
import { Card, Banner, EmptyState, IconButton } from "../../components/admin/Ui";

function formatSize(bytes) {
  if (!bytes) return "—";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

const STATUS_STYLES = {
  ready: "bg-green-50 text-green-700 border-green-100",
  processing: "bg-marigold-50 text-marigold-700 border-marigold-100",
  failed: "bg-red-50 text-red-700 border-red-100",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status] || STATUS_STYLES.processing}`}
    >
      {status === "ready" && <CheckCircle2 size={12} />}
      {status === "processing" && <Loader2 size={12} className="animate-spin" />}
      {status === "failed" && <AlertCircle size={12} />}
      {status}
    </span>
  );
}

export default function AdminKnowledgeBase() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const pollRef = useRef(null);

  const load = useCallback(async () => {
    const { docs } = await getKnowledgeDocs();
    setDocs(docs);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // While any doc is still "processing", poll every 3s so the admin sees
  // status flip to "ready" without manually refreshing.
  useEffect(() => {
    const hasProcessing = docs.some((d) => d.status === "processing");
    if (hasProcessing && !pollRef.current) {
      pollRef.current = setInterval(load, 3000);
    } else if (!hasProcessing && pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [docs, load]);

  async function handleFile(file) {
    if (!file) return;
    if (!/\.pdf$/i.test(file.name)) {
      setError("Only PDF files are supported");
      return;
    }
    setError("");
    setUploading(true);
    try {
      await uploadKnowledgePdf(file);
      await load();
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(doc) {
    if (!confirm(`Delete "${doc.filename}"? The bot will forget everything from this file.`))
      return;
    await deleteKnowledgeDoc(doc._id);
    await load();
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl text-navy-800">Knowledge Base</h1>
        <p className="text-sm text-navy-500 mt-1">
          Upload PDFs (admission brochures, prospectuses, fee structures,
          syllabi) and the "Chat with Admissions" bot will answer student
          questions using them.
        </p>
      </div>

      {error && <Banner type="error">{error}</Banner>}

      <Card>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={`relative rounded-xl border-2 border-dashed transition-colors ${
            dragOver
              ? "border-marigold-400 bg-marigold-50"
              : "border-navy-200 bg-navy-50"
          }`}
        >
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center gap-2 text-navy-400 hover:text-navy-600 py-10"
          >
            {uploading ? (
              <Loader2 size={26} className="animate-spin" />
            ) : (
              <UploadCloud size={26} />
            )}
            <span className="text-sm font-medium">
              {uploading ? "Uploading…" : "Drag & drop a PDF here, or click to choose"}
            </span>
            <span className="text-xs text-navy-400">Up to 20MB per file</span>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              handleFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>
      </Card>

      <Card title="Trained Documents" description={`${docs.length} PDF${docs.length === 1 ? "" : "s"} in the knowledge base`}>
        {loading ? (
          <p className="text-sm text-navy-400 text-center py-8">Loading…</p>
        ) : docs.length === 0 ? (
          <EmptyState text="No PDFs uploaded yet — the bot will only answer from your Courses, Notices, and FAQ pages until you add one." />
        ) : (
          <div className="divide-y divide-navy-100 -mx-5">
            {docs.map((doc) => (
              <div
                key={doc._id}
                className="px-5 py-3.5 flex items-center gap-3"
              >
                <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-navy-50 border border-navy-100 text-navy-500">
                  <FileText size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <a
                    href={doc.cloudinaryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-navy-800 hover:text-marigold-600 truncate flex items-center gap-1.5"
                    title={doc.filename}
                  >
                    <span className="truncate">{doc.filename}</span>
                    <ExternalLink size={12} className="shrink-0 opacity-60" />
                  </a>
                  <p className="text-xs text-navy-400 mt-0.5">
                    {formatSize(doc.sizeBytes)}
                    {doc.status === "ready" && ` · ${doc.chunkCount} chunks`}
                    {doc.status === "failed" && doc.error ? ` · ${doc.error}` : ""}
                    {" · "}
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={doc.status} />
                <IconButton variant="danger" onClick={() => handleDelete(doc)} title="Delete">
                  <Trash2 size={16} />
                </IconButton>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
