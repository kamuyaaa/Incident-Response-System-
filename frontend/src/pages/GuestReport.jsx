import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api, apiUpload } from '../api/client';
import { INCIDENTS } from '../api/endpoints';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LocationPicker } from '../components/map/LocationPicker';
import { ErrorBanner } from '../components/ui/ErrorBanner';
import { CheckCircle, MapPin, Upload, X } from 'lucide-react';

const TYPES = ['Fire', 'Medical', 'Accident', 'Crime', 'Hazard', 'Other'];
const SEVERITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const MAX_IMAGES = 5;

export function GuestReport() {
  const navigate = useNavigate();
  const [coordinates, setCoordinates] = useState(null);
  const [locationAddress, setLocationAddress] = useState('');
  const [type, setType] = useState('Other');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState(null);

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file || media.length >= MAX_IMAGES) return;
    if (!/^image\/(jpeg|png|gif|webp)$/i.test(file.type)) {
      setSubmitError('Please choose a JPEG, PNG, GIF, or WebP image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setSubmitError('Image must be under 5MB.');
      return;
    }
    setUploading(true);
    setSubmitError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await apiUpload(INCIDENTS.reportUpload, formData);
      const url = res.data?.url;
      if (url) {
        const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
        setMedia((m) => [...m, { url: fullUrl, type: 'image' }]);
      }
    } catch (err) {
      setSubmitError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeMedia = (index) => setMedia((m) => m.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    const desc = description.trim();
    if (!desc) {
      setSubmitError('Please describe what happened.');
      return;
    }
    if (!coordinates?.lat || !coordinates?.lng) {
      setSubmitError('Set your location on the map or use "Use my location".');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        type,
        category: type,
        description: desc,
        severity,
        coordinates: { latitude: coordinates.lat, longitude: coordinates.lng },
        address: locationAddress.trim() || coordinates?.address?.trim() || undefined,
        guestReporter: { name: guestName.trim() || undefined, phone: guestPhone.trim() || undefined },
        media: media.length ? media : undefined,
      };
      if (!payload.guestReporter.name && !payload.guestReporter.phone) {
        payload.guestReporter = {};
      }
      const res = await api.post(INCIDENTS.report, payload);
      setSuccessId(res.data._id);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit report. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (successId) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-ers-bg"
      >
        <Card className="w-full max-w-md p-6 sm:p-8 text-center" animate={false}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-flex rounded-xl bg-emergency-50 border border-emergency-100 p-5 mb-5"
          >
            <CheckCircle className="w-14 h-14 text-emergency-600" />
          </motion.div>
          <h1 className="text-xl font-display font-semibold text-ers-ink mb-2">Report submitted</h1>
          <p className="text-ers-inkSecondary text-sm mb-4">
            Emergency services have been notified. Save this reference ID to check status later.
          </p>
          <p className="font-mono text-ers-ink bg-ers-subtle/80 rounded-xl px-4 py-3 mb-6 break-all text-sm border border-ers-subtle">{successId}</p>
          <div className="flex flex-col gap-3">
            <Link to="/login">
              <Button className="w-full min-h-[48px]">Log in to track this incident</Button>
            </Link>
            <Link to="/">
              <Button variant="ghost" className="w-full min-h-[48px]">Back to home</Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-6 sm:py-8 px-4 sm:px-6 bg-ers-bg"
    >
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="text-ers-inkSecondary hover:text-ers-ink text-sm touch-target py-2 -ml-2">← Back</Link>
          <h1 className="text-lg font-display font-semibold text-ers-ink">Report emergency (guest)</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Card className="p-5">
            <h2 className="flex items-center gap-2 text-sm font-medium text-ers-inkSecondary mb-3">
              <MapPin className="w-4 h-4 text-emergency-500" />
              Location
            </h2>
            <LocationPicker
              value={coordinates}
              onChange={(coords) => {
                setCoordinates(coords);
                setLocationAddress(coords?.address ?? '');
              }}
              height="260px"
              autoRequest
            />
            {!coordinates && (
              <p className="text-amber-400/90 text-xs mt-2">Allow location or tap the map to set the incident location.</p>
            )}
          </Card>

          <Card className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-ers-inkSecondary mb-1.5">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="ers-input ers-input-touch">
                {TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ers-inkSecondary mb-1.5">What happened? *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the emergency"
                rows={3}
                className="ers-input resize-none"
                maxLength={2000}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ers-inkSecondary mb-1.5">Severity</label>
              <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="ers-input ers-input-touch">
                {SEVERITIES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Your name (optional)" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="John Doe" />
              <Input label="Phone (optional)" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder="+1234567890" />
            </div>
          </Card>

          <Card className="p-5">
            <label className="block text-sm font-medium text-ers-inkSecondary mb-2">Photos (optional, max 5MB each)</label>
            <div className="flex flex-wrap gap-2">
              {media.map((m, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden bg-ers-subtle/80 border border-ers-subtle">
                  <img src={m.url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeMedia(i)} className="absolute top-1 right-1 p-1.5 rounded-lg bg-ers-elevated border border-ers-subtle text-ers-inkSecondary hover:text-ers-ink touch-target">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {media.length < MAX_IMAGES && (
                <label className="w-20 h-20 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-white/30 text-slate-500 hover:text-ers-inkSecondary transition-colors touch-target">
                  <Upload className="w-6 h-6" />
                  <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" className="hidden" onChange={handleImageSelect} disabled={uploading} />
                </label>
              )}
            </div>
            {uploading && <p className="text-xs text-ers-inkTertiary mt-2">Uploading…</p>}
          </Card>

          {submitError && <ErrorBanner message={submitError} onDismiss={() => setSubmitError('')} />}

          <Button type="submit" disabled={submitting} className="w-full min-h-[52px]">
            {submitting ? 'Submitting…' : 'Submit report'}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
