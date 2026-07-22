import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Camera, Bot, Zap, CheckCircle, Info, ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useReports } from '@/hooks/useReports';
import { WARDS, AREAS_BY_WARD } from '@/lib/mockData';
import { WasteType, Priority, DispatchEvent } from '@/types';
import { FormSuggestion } from '@/types/chat';
import AIDispatchAlert from '@/components/features/AIDispatchAlert';
import AIChatWidget from '@/components/features/AIChatWidget';
import { isDispatchAllowed, AI_DISPATCH_THRESHOLD } from '@/lib/store';

const wasteTypes: { key: WasteType; label: string; emoji: string }[] = [
  { key: 'household',    label: 'Household',    emoji: '🏠' },
  { key: 'organic',      label: 'Organic',      emoji: '🌿' },
  { key: 'construction', label: 'Construction', emoji: '🏗' },
  { key: 'electronic',   label: 'Electronic',   emoji: '📱' },
  { key: 'medical',      label: 'Medical',      emoji: '🏥' },
  { key: 'hazardous',    label: 'Hazardous',    emoji: '⚠️' },
];

const priorities: { key: Priority; label: string; desc: string; color: string }[] = [
  { key: 'low',      label: 'Low',      desc: 'Minor',   color: 'border-gray-300 text-gray-600' },
  { key: 'medium',   label: 'Medium',   desc: 'Moderate', color: 'border-amber-400 text-amber-700' },
  { key: 'high',     label: 'High',     desc: 'Urgent',  color: 'border-orange-500 text-orange-700' },
  { key: 'critical', label: 'Critical', desc: 'Immediate', color: 'border-red-500 text-red-700' },
];

export default function ReportGarbage() {
  const { user } = useAuth();
  const { reports, submitReport } = useReports();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dispatchInfo, setDispatchInfo] = useState<DispatchEvent | null>(null);
  const [aiFilled, setAiFilled] = useState(false);

  const [form, setForm] = useState({
    ward: user?.ward || WARDS[0],
    area: AREAS_BY_WARD[user?.ward || WARDS[0]]?.[0] || '',
    location: '',
    wasteType: 'household' as WasteType,
    priority: 'medium' as Priority,
    description: '',
  });

  const areas = AREAS_BY_WARD[form.ward] || [];

  const areaReportCount = reports.filter(r =>
    r.ward === form.ward && r.area === form.area &&
    (r.status === 'pending' || r.status === 'acknowledged')
  ).length;

  const handleAIFill = (suggestion: FormSuggestion) => {
    setForm(f => ({
      ...f,
      ...(suggestion.wasteType ? { wasteType: suggestion.wasteType as WasteType } : {}),
      ...(suggestion.priority   ? { priority: suggestion.priority as Priority }   : {}),
      ...(suggestion.description ? { description: suggestion.description }         : {}),
      ...(suggestion.location    ? { location: suggestion.location }               : {}),
    }));
    setAiFilled(true);
    setTimeout(() => setAiFilled(false), 3000);
    // Scroll form into view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.location.trim() || !form.description.trim()) return;
    setSubmitting(true);

    setTimeout(() => {
      const result = submitReport({
        userId: user?.id || 'guest',
        userName: user?.name || 'Anonymous',
        userPhone: user?.phone,
        location: form.location,
        ward: form.ward,
        area: form.area,
        wasteType: form.wasteType,
        description: form.description,
        priority: form.priority,
      });
      setSubmitting(false);
      setSubmitted(true);
      if (result.dispatched && result.dispatchInfo) {
        setDispatchInfo(result.dispatchInfo);
      }
    }, 900);
  };

  if (submitted && !dispatchInfo) {
    setTimeout(() => navigate('/dashboard'), 3000);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* AI Chat Widget — report-page mode with form fill */}
      <AIChatWidget onFillForm={handleAIFill} showOnReportPage />

      {/* Dispatch Alert */}
      {dispatchInfo && (
        <AIDispatchAlert
          dispatch={dispatchInfo}
          onClose={() => { setDispatchInfo(null); navigate('/dashboard'); }}
        />
      )}

      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>Report Garbage</h1>
        <p className="text-muted-foreground text-sm mt-1">Help keep your neighbourhood clean. Every report counts.</p>
      </div>

      {/* AI Fill Success Banner */}
      {aiFilled && (
        <div className="mb-4 p-3 bg-emerald-50 border-2 border-emerald-400 rounded-2xl flex items-center gap-2.5 slide-in-up">
          <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p className="text-sm font-semibold text-emerald-700">AI has pre-filled the form! Review and adjust as needed.</p>
        </div>
      )}

      {/* AI Threshold Warning */}
      {areaReportCount >= AI_DISPATCH_THRESHOLD - 1 && (
        <div className="mb-5 p-4 bg-amber-50 border-2 border-amber-400 rounded-2xl flex items-start gap-3">
          <Bot className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-800">
              {areaReportCount >= AI_DISPATCH_THRESHOLD
                ? '🚛 AI Dispatch Already Triggered!'
                : `⚡ ${areaReportCount}/${AI_DISPATCH_THRESHOLD} reports — almost there!`}
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              {areaReportCount >= AI_DISPATCH_THRESHOLD
                ? 'A garbage truck has already been dispatched to this area.'
                : `One more report from ${form.area} will trigger auto AI dispatch${!isDispatchAllowed() ? ' at 6 AM' : ' now'}!`}
            </p>
          </div>
        </div>
      )}

      {submitted ? (
        <div className="bg-white border-2 border-emerald-400 rounded-3xl p-8 text-center slide-in-up">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>Report Submitted!</h2>
          <p className="text-muted-foreground text-sm mb-5">Your report has been registered. You'll be notified when action is taken.</p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-4">
            <p className="text-sm text-emerald-700 font-medium">
              {areaReportCount + 1 >= AI_DISPATCH_THRESHOLD
                ? '🤖 AI has detected enough reports — a garbage truck is being dispatched!'
                : `📊 ${areaReportCount + 1}/${AI_DISPATCH_THRESHOLD} reports from this area. ${AI_DISPATCH_THRESHOLD - areaReportCount - 1} more needed for auto-dispatch.`}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">Redirecting to dashboard…</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-border rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 space-y-6">

            {/* Ward & Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Ward</label>
                <select
                  value={form.ward}
                  onChange={e => setForm(f => ({ ...f, ward: e.target.value, area: AREAS_BY_WARD[e.target.value]?.[0] || '' }))}
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:ring-2 focus:ring-[hsl(158,64%,32%)] outline-none bg-white"
                >
                  {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Area</label>
                <select
                  value={form.area}
                  onChange={e => setForm(f => ({ ...f, area: e.target.value }))}
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:ring-2 focus:ring-[hsl(158,64%,32%)] outline-none bg-white"
                >
                  {areas.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>

            {/* Exact Location */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[hsl(158,64%,32%)]" />
                  Exact Location / Landmark
                </span>
              </label>
              <input
                type="text"
                required
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                placeholder="e.g., Near Park Gate, 5th Block Main Road"
                className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:ring-2 focus:ring-[hsl(158,64%,32%)] outline-none"
              />
            </div>

            {/* Waste Type */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Waste Type</label>
              <div className="grid grid-cols-3 gap-2">
                {wasteTypes.map(wt => (
                  <button
                    key={wt.key}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, wasteType: wt.key }))}
                    className={`flex flex-col items-center gap-1.5 p-3 border-2 rounded-xl transition-all text-center ${
                      form.wasteType === wt.key
                        ? 'border-[hsl(158,64%,32%)] bg-emerald-50 shadow-sm'
                        : 'border-border hover:border-[hsl(158,64%,32%)] hover:bg-emerald-50/30'
                    }`}
                  >
                    <span className="text-2xl">{wt.emoji}</span>
                    <span className="text-xs font-semibold text-foreground">{wt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Priority Level</label>
              <div className="grid grid-cols-4 gap-2">
                {priorities.map(p => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, priority: p.key }))}
                    className={`p-2.5 border-2 rounded-xl text-center transition-all ${
                      form.priority === p.key
                        ? 'border-[hsl(158,64%,32%)] bg-emerald-50 shadow-sm'
                        : `${p.color} hover:border-[hsl(158,64%,32%)]`
                    }`}
                  >
                    <p className="text-xs font-bold">{p.label}</p>
                    <p className="text-[10px] opacity-70 mt-0.5">{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Description</label>
              <textarea
                required
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Describe the garbage issue — size, smell, hazard level, how long it's been there…"
                rows={4}
                className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:ring-2 focus:ring-[hsl(158,64%,32%)] outline-none resize-none"
              />
            </div>

            {/* Photo Upload (placeholder) */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[hsl(158,64%,32%)]" />
                  Add Photo (Optional)
                </span>
              </label>
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-[hsl(158,64%,32%)] transition-colors cursor-pointer bg-muted/20">
                <Camera className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground font-medium">Drag & drop or click to upload</p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">JPG, PNG up to 5MB</p>
              </div>
            </div>

            {/* AI Dispatch Info */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
              <Info className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-700 leading-relaxed">
                <p className="font-bold mb-0.5">AI Auto-Dispatch</p>
                <p>When <strong>{AI_DISPATCH_THRESHOLD}+ reports</strong> arrive from the same area, the AI automatically dispatches a garbage truck during daytime hours (6 AM – 9 PM).</p>
                {!isDispatchAllowed() && (
                  <p className="mt-1 text-amber-700 font-semibold">⚠ Night mode active — dispatches scheduled for 6:00 AM.</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="px-6 pb-6">
            <button
              type="submit"
              disabled={submitting}
              className="w-full gradient-brand text-white py-4 rounded-2xl font-bold text-base hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting Report…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" />
                  Submit Report
                </span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
