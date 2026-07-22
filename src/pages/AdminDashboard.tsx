import { useState, useEffect } from 'react';
import { FileText, Truck, CheckCircle, Clock, Bot, Zap, TrendingUp, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useReports } from '@/hooks/useReports';
import StatsCard from '@/components/features/StatsCard';
import LocationHeatmap from '@/components/features/LocationHeatmap';
import { isDispatchAllowed, getDispatchTimeMessage, AI_DISPATCH_THRESHOLD } from '@/lib/store';
import { checkAIDispatch } from '@/lib/mockData';
import { formatDistanceToNow, getStatusColor } from '@/lib/utils';

export default function AdminDashboard() {
  const { reports, dispatches, updateReportStatus } = useReports();
  const [aiAlerts, setAiAlerts] = useState<string[]>([]);

  useEffect(() => {
    const dispatchMap = checkAIDispatch(reports);
    const alerts: string[] = [];
    dispatchMap.forEach((rpts, key) => {
      const [, area] = key.split('|');
      const ward = key.split('|')[0];
      alerts.push(`${area} (${ward.split('–')[0].trim()}) — ${rpts.length} active reports`);
    });
    setAiAlerts(alerts);
  }, [reports]);

  const stats = {
    total:       reports.length,
    pending:     reports.filter(r => r.status === 'pending').length,
    dispatched:  reports.filter(r => r.status === 'dispatched').length,
    resolved:    reports.filter(r => r.status === 'resolved').length,
    critical:    reports.filter(r => r.priority === 'critical' && r.status === 'pending').length,
    aiDispatches: dispatches.filter(d => d.aiInitiated).length,
  };

  const recentReports = [...reports]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const wardActivity = reports.reduce<Record<string, number>>((acc, r) => {
    acc[r.ward] = (acc[r.ward] || 0) + 1;
    return acc;
  }, {});
  const topWards = Object.entries(wardActivity).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>Admin Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">Real-time waste management command centre</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${isDispatchAllowed() ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          <Bot className="w-4 h-4" />
          AI: {isDispatchAllowed() ? 'Active' : 'Night Mode'}
        </div>
      </div>

      {/* AI Threshold Alerts */}
      {aiAlerts.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="relative">
              <Bot className="w-5 h-5 text-red-600" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full pulse-ring" />
            </div>
            <p className="font-bold text-red-700 text-sm">
              AI Threshold Reached — {aiAlerts.length} Location{aiAlerts.length > 1 ? 's' : ''}
            </p>
            {!isDispatchAllowed() && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">Queued for 6 AM</span>
            )}
          </div>
          <div className="space-y-1">
            {aiAlerts.map((a, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-red-700">
                <Zap className="w-3 h-3 flex-shrink-0" />
                <span>{a}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-red-600 mt-2 font-medium">
            {isDispatchAllowed()
              ? 'Garbage trucks are being automatically dispatched.'
              : `Dispatches will trigger at 6:00 AM. ${getDispatchTimeMessage()}`}
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatsCard title="Total Reports" value={stats.total}    icon={FileText}       color="blue" />
        <StatsCard title="Pending"       value={stats.pending}  icon={Clock}          color="amber" />
        <StatsCard title="Dispatched"    value={stats.dispatched} icon={Truck}        color="emerald" />
        <StatsCard title="Resolved"      value={stats.resolved} icon={CheckCircle}    color="green" />
        <StatsCard title="Critical"      value={stats.critical} icon={AlertTriangle}  color="red" />
        <StatsCard title="AI Dispatches" value={stats.aiDispatches} icon={Bot}        color="purple" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reports Table */}
        <div className="lg:col-span-2 bg-white border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>Recent Reports</h2>
            <Link to="/admin/reports" className="text-sm text-[hsl(158,64%,32%)] hover:underline font-medium">
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Reporter</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Location</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {recentReports.map(r => (
                  <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 gradient-brand rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {r.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground truncate max-w-[80px]">{r.userName}</p>
                          <p className="text-[10px] text-muted-foreground capitalize">{r.wasteType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-foreground truncate max-w-[110px]">{r.area}</p>
                      <p className="text-[10px] text-muted-foreground">{r.ward.split('–')[0].trim()}</p>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={r.status}
                        onChange={e => updateReportStatus(r.id, e.target.value as any)}
                        className={`text-xs px-2 py-1 rounded-full font-semibold border-0 cursor-pointer outline-none ${getStatusColor(r.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="acknowledged">Acknowledged</option>
                        <option value="dispatched">Dispatched</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(r.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <LocationHeatmap reports={reports} />

          {/* Top Wards */}
          <div className="bg-white border border-border rounded-2xl p-5">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2" style={{ fontFamily: 'Sora, sans-serif' }}>
              <TrendingUp className="w-4 h-4 text-[hsl(158,64%,32%)]" />
              Top Wards
            </h3>
            <div className="space-y-3">
              {topWards.map(([ward, count]) => {
                const pct = Math.round((count / reports.length) * 100);
                return (
                  <div key={ward}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-foreground truncate">{ward.split('–')[1]?.trim() || ward}</span>
                      <span className="text-xs font-bold text-muted-foreground ml-2 flex-shrink-0">{count}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full gradient-brand transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Dispatches */}
          <div className="bg-white border border-border rounded-2xl p-5">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2" style={{ fontFamily: 'Sora, sans-serif' }}>
              <Truck className="w-4 h-4 text-[hsl(158,64%,32%)]" />
              Active Dispatches
            </h3>
            {dispatches.filter(d => d.status !== 'completed').length === 0 ? (
              <p className="text-sm text-muted-foreground">No active dispatches</p>
            ) : (
              <div className="space-y-2.5">
                {dispatches.filter(d => d.status !== 'completed').map(d => (
                  <div key={d.id} className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-foreground">{d.truckId}</span>
                      <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full font-bold">En Route</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{d.area} · {d.driverName}</p>
                    {d.aiInitiated && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">
                        <Bot className="w-2.5 h-2.5" /> AI
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
