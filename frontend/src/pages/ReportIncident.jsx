import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api/client';
import { INCIDENTS } from '../api/endpoints';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LocationPicker } from '../components/map/LocationPicker';
import { EvidenceCapture } from '../components/incident/EvidenceCapture';
import { ErrorBanner } from '../components/ui/ErrorBanner';
import { CheckCircle, MapPin, Flame, Heart, Car, Shield, LifeBuoy, HelpCircle } from 'lucide-react';

const CATEGORIES = [
  { value: 'Fire', label: 'Fire', icon: Flame },
  { value: 'Medical Emergency', label: 'Medical', icon: Heart },
  { value: 'Road Accident', label: 'Accident', icon: Car },
  { value: 'Security Threat', label: 'Security', icon: Shield },
  { value: 'Rescue Request', label: 'Rescue', icon: LifeBuoy },
  { value: 'Other', label: 'Other', icon: HelpCircle },
];
const SEVERITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const reportSchema = z.object({
  category: z.string().min(1, 'Select a category'),
  title: z.string().min(1, 'Enter a short title').max(120, 'Max 120 characters'),
  description: z.string().min(1, 'Describe what happened').max(2000, 'Max 2000 characters'),
  severity: z.enum(['low', 'medium', 'high', 'critical'], { required_error: 'Select severity' }),
  address: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export function ReportIncident() {
  const navigate = useNavigate();
  const [coordinates, setCoordinates] = useState(null);
  const [evidence, setEvidence] = useState([]);
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      category: '',
      title: '',
      description: '',
      severity: 'medium',
      address: '',
      notes: '',
    },
  });

  const category = watch('category');
  const severity = watch('severity');

  const onSubmit = async (data) => {
    if (!coordinates?.lat || !coordinates?.lng) {
      setSubmitError('Set your location on the map or use “Use my location”.');
      return;
    }
    if (!data.category) {
      setSubmitError('Select an incident type.');
      return;
    }
    setSubmitError('');
    try {
      const payload = {
        title: data.title.trim(),
        description: data.description.trim(),
        category: data.category,
        priority: data.severity,
        severity: data.severity,
        address: data.address?.trim() || undefined,
        coordinates: [coordinates.lng, coordinates.lat],
      };
      const res = await api.post(INCIDENTS.create, payload);
      setSuccess(true);
      setTimeout(() => navigate(`/incidents/${res.data._id}`, { replace: true }), 1200);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit. Please try again.');
    }
  };

  if (success) {
    return (
      <PageLayout title="Report submitted">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="max-w-md mx-auto pt-6"
        >
          <motion.div
            className="rounded-xl surface-card p-6 sm:p-8 text-center"
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.08, type: 'spring', stiffness: 200 }}
              className="inline-flex rounded-full bg-emergency-50 p-4 mb-4"
            >
              <CheckCircle className="w-12 h-12 text-emergency-600" />
            </motion.div>
            <h2 className="text-h3 text-ers-ink mb-1.5">We got your report</h2>
            <p className="text-body-sm text-ers-inkSecondary mb-5">
              You’ll be taken to your incident page to track status and responder ETA.
            </p>
            <div className="inline-flex h-1.5 w-40 rounded-full bg-ers-subtle overflow-hidden">
              <motion.div
                className="h-full bg-emergency-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        </motion.div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Report emergency" subtitle="Your location helps us dispatch quickly">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-2xl mx-auto pb-8"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="rounded-xl surface-card overflow-hidden">
            <div className="p-4 border-b border-ers-subtle">
              <h3 className="flex items-center gap-2 text-label font-semibold text-ers-ink">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0" aria-hidden />
                Location
              </h3>
              <p className="text-caption text-ers-inkSecondary mt-0.5">
                Auto-detected or tap the map. Responders use this to reach you.
              </p>
            </div>
            <div className="p-4 pt-0">
              <LocationPicker
                value={coordinates}
                onChange={(coords) => {
                  setCoordinates(coords);
                  if (coords?.address != null) setValue('address', coords.address);
                }}
                height="260px"
                autoRequest
              />
              {!coordinates && (
                <p className="text-warning text-caption mt-2">
                  Allow location access or tap the map to set the incident location.
                </p>
              )}
            </div>
          </div>

          {/* Category — visual chips */}
          <div className="rounded-xl surface-card p-4">
            <h3 className="text-label font-semibold text-ers-ink mb-2">What type of emergency?</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((c) => {
                const Icon = c.icon;
                const selected = category === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setValue('category', c.value, { shouldValidate: true })}
                    className={`rounded-xl p-3 sm:p-3.5 flex items-center gap-2 border transition-all text-left touch-target min-h-[52px] ${
                      selected
                        ? 'bg-emergency-500/20 border-emergency-500/50 text-ers-ink'
                        : 'bg-ers-subtle/80 border-ers-subtle text-ers-ink hover:bg-ers-subtle hover:text-ers-ink'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${selected ? 'text-emergency-600' : 'text-ers-inkSecondary'}`} />
                    <span className="font-medium text-sm truncate">{c.label}</span>
                  </button>
                );
              })}
            </div>
            {errors.category && (
              <p className="mt-2 text-body-sm text-critical" role="alert">{errors.category.message}</p>
            )}
          </div>

          {/* Severity */}
          <div className="rounded-xl surface-card p-4">
            <h3 className="text-label font-semibold text-ers-ink mb-2">Severity</h3>
            <div className="flex flex-wrap gap-2">
              {SEVERITIES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setValue('severity', s.value, { shouldValidate: true })}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium border transition-all touch-target ${
                    severity === s.value
                      ? 'bg-ers-elevated/80 border-ers-subtle text-ers-ink'
                      : 'bg-ers-subtle/80 border-ers-subtle text-ers-inkSecondary hover:text-ers-ink'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title + Description */}
          <div className="rounded-xl surface-card p-4 sm:p-5 space-y-4">
            <h3 className="text-sm font-semibold text-ers-ink">Details</h3>
            <Input
              label="Short title"
              placeholder="e.g. Vehicle fire at Main & 5th"
              maxLength={120}
              error={errors.title?.message}
              {...register('title')}
              className="ers-input-touch"
              aria-invalid={!!errors.title}
            />
            <div>
              <label className="block text-sm font-medium text-ers-inkSecondary mb-1">What happened?</label>
              <textarea
                {...register('description')}
                placeholder="Brief description. Include any immediate dangers."
                rows={3}
                className="ers-input resize-none min-h-[88px]"
                maxLength={2000}
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-400" role="alert">{errors.description.message}</p>
              )}
            </div>
            <Input
              label="Address (optional)"
              placeholder="Street, city"
              {...register('address')}
            />
          </div>

          {/* Evidence — optional */}
          <div className="rounded-xl surface-card p-4 sm:p-5">
            <EvidenceCapture value={evidence} onChange={setEvidence} maxCount={4} />
          </div>

          <AnimatePresence mode="wait">
            {submitError && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <ErrorBanner message={submitError} onDismiss={() => setSubmitError('')} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
              className="min-h-[52px] w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 min-h-[52px] text-base font-semibold w-full sm:w-auto"
            >
              {isSubmitting ? 'Submitting…' : 'Submit report'}
            </Button>
          </div>
        </form>
      </motion.div>
    </PageLayout>
  );
}
