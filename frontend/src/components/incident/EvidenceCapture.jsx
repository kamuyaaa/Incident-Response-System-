import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, X, Image } from 'lucide-react';
import { Button } from '../ui/Button';

export function EvidenceCapture({ value = [], onChange, maxCount = 4 }) {
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const files = Array.isArray(value) ? value : [];

  const handleFileSelect = async (e) => {
    const chosen = Array.from(e.target.files || []);
    if (!chosen.length) return;
    setError(null);
    const toAdd = chosen.filter((f) => f.type.startsWith('image/')).slice(0, maxCount - files.length);
    const read = (file) =>
      new Promise((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve({ type: 'dataurl', data: r.result, name: file.name });
        r.readAsDataURL(file);
      });
    const newItems = await Promise.all(toAdd.map(read));
    if (newItems.length) onChange?.([...files, ...newItems]);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleCapture = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setCapturing(true);
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      await new Promise((res) => { video.onloadeddata = res; });
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      stream.getTracks().forEach((t) => t.stop());
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      const next = [...files, { type: 'dataurl', data: dataUrl, name: `capture-${Date.now()}.jpg` }];
      if (next.length <= maxCount) onChange?.(next);
    } catch (err) {
      setError(err.message || 'Camera not available');
    } finally {
      setCapturing(false);
    }
  };

  const remove = (index) => {
    const next = files.filter((_, i) => i !== index);
    onChange?.(next);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-ers-inkSecondary mb-1.5">Evidence (optional)</label>
      <div className="flex flex-wrap gap-2">
        {files.map((item, i) => (
          <motion.div
            key={i}
            layout
            className="relative w-20 h-20 rounded-lg overflow-hidden bg-ers-subtle border border-ers-subtle"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {item.data ? (
              <img src={item.data} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Image className="w-8 h-8 text-ers-inkTertiary" />
              </div>
            )}
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black/80"
              aria-label="Remove"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
        {files.length < maxCount && (
          <>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-20 h-20 rounded-lg border-2 border-dashed border-2 border-dashed border-ers-subtle hover:border-ers-inkSecondary flex items-center justify-center text-ers-inkTertiary hover:text-ers-inkSecondary transition-colors"
              aria-label="Add photo or upload image"
            >
              <Image className="w-8 h-8" />
            </button>
            <button
              type="button"
              onClick={handleCapture}
              disabled={capturing}
              className="w-20 h-20 rounded-lg border-2 border-dashed border-emergency-500/50 hover:border-emergency-500 flex items-center justify-center text-emergency-400 hover:text-emergency-300 transition-colors disabled:opacity-50"
              aria-label="Take camera snapshot"
            >
              <Camera className="w-8 h-8" />
            </button>
          </>
        )}
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {capturing && <p className="text-sm text-ers-inkTertiary">Capturing…</p>}
    </div>
  );
}
