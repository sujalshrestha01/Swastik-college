import { useRef, useState } from "react";
import { UploadCloud, X, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { uploadImages, resolveImageUrl } from "../../api/client";

/**
 * Manages an ordered list of image URLs for the homepage hero carousel.
 * Props:
 *  - images: string[] — array of stored image paths/URLs
 *  - onChange: (images: string[]) => void
 */
export default function HeroCarouselUpload({ images = [], onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(fileList) {
    const files = Array.from(fileList || []).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (files.length === 0) return;
    setError("");
    setUploading(true);
    try {
      const { files: uploaded } = await uploadImages(files);
      onChange([...images, ...uploaded.map((f) => f.url)]);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(idx) {
    onChange(images.filter((_, i) => i !== idx));
  }

  function moveImage(idx, direction) {
    const target = idx + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((url, idx) => (
          <div
            key={url + idx}
            className="relative rounded-xl overflow-hidden border-2 border-navy-100 bg-navy-50 group"
          >
            <img
              src={resolveImageUrl(url)}
              alt=""
              className="w-full h-28 object-cover"
            />
            <span className="absolute top-1.5 left-1.5 bg-navy-900/80 text-paper text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              #{idx + 1}
            </span>
            <div className="absolute inset-0 bg-navy-950/0 group-hover:bg-navy-950/40 transition-colors flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
              {idx > 0 && (
                <button
                  type="button"
                  onClick={() => moveImage(idx, -1)}
                  className="p-1.5 rounded-full bg-white/90 text-navy-700 hover:bg-white"
                  title="Move earlier"
                >
                  <ArrowUp size={13} />
                </button>
              )}
              {idx < images.length - 1 && (
                <button
                  type="button"
                  onClick={() => moveImage(idx, 1)}
                  className="p-1.5 rounded-full bg-white/90 text-navy-700 hover:bg-white"
                  title="Move later"
                >
                  <ArrowDown size={13} />
                </button>
              )}
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="p-1.5 rounded-full bg-white/90 text-red-600 hover:bg-white"
                title="Remove"
              >
                <X size={13} />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="h-28 rounded-xl border-2 border-dashed border-navy-200 hover:border-marigold-400 hover:bg-marigold-50 flex flex-col items-center justify-center gap-1 text-navy-400 hover:text-navy-600 transition-colors"
        >
          {uploading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <UploadCloud size={20} />
          )}
          <span className="text-[11px] font-medium">
            {uploading ? "Uploading…" : "Add photos"}
          </span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <p className="text-xs text-navy-400">
        Add as many photos as you like. Use the arrows to reorder — the carousel
        plays them in this order. Leave empty to show a single static hero image
        instead.
      </p>
    </div>
  );
}
