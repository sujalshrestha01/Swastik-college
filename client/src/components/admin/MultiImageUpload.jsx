import { useRef, useState } from 'react';
import { UploadCloud, X, Loader2, Star } from 'lucide-react';
import { uploadImages, resolveImageUrl } from '../../api/client';

/**
 * Multi-image upload widget for gallery events.
 *
 * Props:
 *  - images: [{ _id?, url, caption }]
 *  - onChange: (images) => void
 *  - thumbnailId: string — id (or url, for not-yet-saved images) marking the cover photo
 *  - onThumbnailChange: (id) => void
 */
export default function MultiImageUpload({ images = [], onChange, thumbnailId, onThumbnailChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  function keyFor(img, idx) {
    return img._id || img.url || `idx-${idx}`;
  }

  async function handleFiles(fileList) {
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) return;
    setError('');
    setUploading(true);
    try {
      const { files: uploaded } = await uploadImages(files);
      const newImages = uploaded.map((f) => ({ url: f.url, caption: '' }));
      const combined = [...images, ...newImages];
      onChange(combined);
      // Auto-pick a thumbnail if none chosen yet
      if (!thumbnailId && combined.length > 0) {
        onThumbnailChange(keyFor(combined[0], 0));
      }
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function removeImage(idx) {
    const removedKey = keyFor(images[idx], idx);
    const next = images.filter((_, i) => i !== idx);
    onChange(next);
    if (removedKey === thumbnailId) {
      onThumbnailChange(next.length > 0 ? keyFor(next[0], 0) : '');
    }
  }

  function updateCaption(idx, caption) {
    const next = images.map((img, i) => (i === idx ? { ...img, caption } : img));
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((img, idx) => {
          const key = keyFor(img, idx);
          const isThumb = key === thumbnailId;
          return (
            <div
              key={key}
              className={`relative rounded-xl overflow-hidden border-2 bg-navy-50 group ${
                isThumb ? 'border-marigold-400' : 'border-navy-100'
              }`}
            >
              <img src={resolveImageUrl(img.url)} alt="" className="w-full h-28 object-cover" />
              {isThumb && (
                <span className="absolute top-1.5 left-1.5 bg-marigold-400 text-navy-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                  <Star size={10} fill="currentColor" /> Thumbnail
                </span>
              )}
              <div className="absolute inset-0 bg-navy-950/0 group-hover:bg-navy-950/40 transition-colors flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                {!isThumb && (
                  <button
                    type="button"
                    onClick={() => onThumbnailChange(key)}
                    className="p-1.5 rounded-full bg-white/90 text-navy-700 hover:bg-white"
                    title="Set as thumbnail"
                  >
                    <Star size={13} />
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
              <input
                value={img.caption || ''}
                onChange={(e) => updateCaption(idx, e.target.value)}
                placeholder="Caption (optional)"
                className="w-full text-[11px] px-2 py-1 border-t border-navy-100 focus:outline-none"
              />
            </div>
          );
        })}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="h-28 rounded-xl border-2 border-dashed border-navy-200 hover:border-marigold-400 hover:bg-marigold-50 flex flex-col items-center justify-center gap-1 text-navy-400 hover:text-navy-600 transition-colors"
        >
          {uploading ? <Loader2 size={20} className="animate-spin" /> : <UploadCloud size={20} />}
          <span className="text-[11px] font-medium">{uploading ? 'Uploading…' : 'Add photos'}</span>
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
          e.target.value = '';
        }}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <p className="text-xs text-navy-400">
        Upload as many photos as you like, then click the star on any photo to set it as the album thumbnail shown
        on the public gallery grid.
      </p>
    </div>
  );
}
