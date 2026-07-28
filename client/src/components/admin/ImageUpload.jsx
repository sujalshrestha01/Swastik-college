import { useRef, useState } from 'react';
import { UploadCloud, X, Loader2, ImageOff } from 'lucide-react';
import { uploadImage, resolveImageUrl } from '../../api/client';

/**
 * Device image upload widget.
 *
 * Props:
 *  - value: string (stored path, e.g. "/uploads/xyz.jpg" or a full URL)
 *  - onChange: (path: string) => void — called with the new stored path after upload,
 *              or '' when removed
 *  - label / hint: optional field chrome
 *  - aspect: tailwind aspect-ratio class for the preview box (default 'aspect-video')
 *  - shape: 'square' | 'circle' | 'video' — quick preset for common use cases (photo vs banner)
 */
export default function ImageUpload({ value, onChange, label, hint, shape = 'video' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const aspectCls = shape === 'square' || shape === 'circle' ? 'aspect-square' : 'aspect-video';
  const shapeCls = shape === 'circle' ? 'rounded-full' : 'rounded-xl';

  async function handleFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const result = await uploadImage(file);
      onChange(result.url);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function handleInputChange(e) {
    handleFile(e.target.files?.[0]);
    e.target.value = '';
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  return (
    <div>
      {label && <span className="block text-sm font-medium text-navy-700 mb-1">{label}</span>}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative overflow-hidden border-2 border-dashed transition-colors ${shapeCls} ${
          value ? 'border-transparent' : dragOver ? 'border-marigold-400 bg-marigold-50' : 'border-navy-200 bg-navy-50'
        } ${shape === 'circle' ? 'w-28 h-28' : `w-full ${aspectCls} max-w-sm`}`}
      >
        {value ? (
          <>
            <img src={resolveImageUrl(value)} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-navy-950/0 hover:bg-navy-950/40 transition-colors flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="p-2 rounded-full bg-white/90 text-navy-700 hover:bg-white"
                title="Replace image"
              >
                <UploadCloud size={16} />
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="p-2 rounded-full bg-white/90 text-red-600 hover:bg-white"
                title="Remove image"
              >
                <X size={16} />
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-navy-400 hover:text-navy-600"
          >
            {uploading ? (
              <Loader2 size={22} className="animate-spin" />
            ) : shape === 'circle' ? (
              <ImageOff size={20} />
            ) : (
              <UploadCloud size={22} />
            )}
            <span className="text-xs font-medium px-2 text-center">
              {uploading ? 'Uploading…' : 'Click or drag an image here'}
            </span>
          </button>
        )}
        {uploading && value && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <Loader2 size={22} className="animate-spin text-navy-600" />
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleInputChange} />
      {hint && !error && <span className="block text-xs text-navy-400 mt-1">{hint}</span>}
      {error && <span className="block text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
}
