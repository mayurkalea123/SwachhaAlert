import { GarbageReport } from '@/types';
import { AI_DISPATCH_THRESHOLD } from '@/lib/store';
import { Bot, AlertTriangle, CheckCircle, Flame } from 'lucide-react';

interface Props {
  reports: GarbageReport[];
}

export default function LocationHeatmap({ reports }: Props) {
  const locationMap = new Map<string, { ward: string; area: string; count: number; statuses: string[] }>();

  reports.forEach(r => {
    const key = `${r.ward}|${r.area}`;
    const existing = locationMap.get(key);
    if (existing) {
      existing.count++;
      existing.statuses.push(r.status);
    } else {
      locationMap.set(key, { ward: r.ward, area: r.area, count: 1, statuses: [r.status] });
    }
  });

  const locations = Array.from(locationMap.values()).sort((a, b) => b.count - a.count);
  const maxCount = locations[0]?.count || 1;

  const getColorClass = (count: number) => {
    const ratio = count / AI_DISPATCH_THRESHOLD;
    if (count >= AI_DISPATCH_THRESHOLD) return 'bg-red-50 border-red-300 text-red-800';
    if (ratio >= 0.6) return 'bg-orange-50 border-orange-300 text-orange-800';
    if (ratio >= 0.3) return 'bg-amber-50 border-amber-200 text-amber-800';
    return 'bg-emerald-50 border-emerald-200 text-emerald-700';
  };

  const getBarColor = (count: number) => {
    if (count >= AI_DISPATCH_THRESHOLD) return 'bg-red-500';
    if (count >= 3) return 'bg-orange-400';
    return 'bg-emerald-500';
  };

  return (
    <div className="bg-white border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>Report Hotspots</h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-lg">
          <Bot className="w-3.5 h-3.5 text-emerald-600" />
          <span>AI @ {AI_DISPATCH_THRESHOLD}+</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {locations.slice(0, 8).map(loc => {
          const isHot = loc.count >= AI_DISPATCH_THRESHOLD;
          const anyDispatched = loc.statuses.some(s => s === 'dispatched');
          const colorClass = getColorClass(loc.count);
          const barWidth = Math.max(8, (loc.count / maxCount) * 100);

          return (
            <div key={`${loc.ward}|${loc.area}`} className={`border rounded-xl p-3 transition-all ${colorClass}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  {isHot ? (
                    <Flame className="w-3.5 h-3.5 flex-shrink-0 text-red-500" />
                  ) : anyDispatched ? (
                    <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  )}
                  <span className="text-xs font-bold truncate">{loc.area}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-xs font-bold">{loc.count}</span>
                  {isHot && (
                    <span className="text-[9px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">AI!</span>
                  )}
                  {anyDispatched && !isHot && (
                    <span className="text-[9px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded-full">Sent</span>
                  )}
                </div>
              </div>

              {/* Bar */}
              <div className="h-1.5 bg-black/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${getBarColor(loc.count)}`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>

              {/* Threshold line indicator */}
              <div className="flex items-center justify-between mt-1">
                <span className="text-[9px] opacity-50">{loc.ward.split('–')[0].trim()}</span>
                <span className="text-[9px] opacity-50">threshold: {AI_DISPATCH_THRESHOLD}</span>
              </div>
            </div>
          );
        })}
      </div>

      {locations.length === 0 && (
        <div className="py-8 text-center">
          <Bot className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No reports filed yet</p>
        </div>
      )}
    </div>
  );
}
