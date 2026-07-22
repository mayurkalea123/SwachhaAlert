import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Clock, Truck, CheckCircle, Bot, MapPin, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useReports } from '@/hooks/useReports';
import StatsCard from '@/components/features/StatsCard';
import ReportCard from '@/components/features/ReportCard';
import LocationHeatmap from '@/components/features/LocationHeatmap';
import { isDispatchAllowed, getDispatchTimeMessage, AI_DISPATCH_THRESHOLD } from '@/lib/store';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const { reports, dispatches, upvoteReport } = useReports();
  const [filter, setFilter] = useState<string>('all');

  const myReports   = reports.filter(r => r.userId === user?.id);
  const areaReports = reports.filter(r => r.ward === user?.ward);
  const nearbyHotspot = reports.filter(r =>
    r.ward === user?.ward && (r.status === 'pending' || r.status === 'acknowledged')
  );

  const stats = {
    total:      myReports.length,
    pending:    myReports.filter(r => r.status === 'pending').length,
    resolved:   myReports.filter(r => r.status === 'resolved').length,
    dispatched: myReports.filter(r => r.status === 'dispatched' || r.aiTriggered).length,
  };

  const displayReports = areaReports.filter(r => filter === 'all' || r.status === filter);

  const filterTabs = [
    { key: 'all',          label: 'All' },
    { key: 'pending',      label: 'Pending' },
    { key: 'acknowledged', label: 'Acknowledged' },
    { key: 'dispatched',   label: 'Dispatched' },
    { key: 'resolved',     label: 'Resolved' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <MapPin className="w-4 h-4 text-[hsl(158,64%,32%)]" />
            <span className="text-sm text-muted-foreground">{user?.ward}</span>
          </div>
        </div>
        <Link
          to="/report"
          className="inline-flex items-center gap-2 px-5 py-3 gradient-brand text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-lg hover:shadow-emerald-500/30 text-sm"
        >
          <Plus className="w-4 h-4" />
          Report Garbage
        </Link>
      </div>

      {/* AI Status Banner */}
      <div className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 ${isDispatchAllowed() ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isDispatchAllowed() ? 'bg-emerald-100' : 'bg-amber-100'}`}>
          <Bot className={`w-5 h-5 ${isDispatchAllowed() ? 'text-emerald-600' : 'text-amber-600'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold ${isDispatchAllowed() ? 'text-emerald-700' : 'text-amber-700'}`}>
            {isDispatchAllowed() ? '🟢 AI Dispatch Active' : '🟡 AI Dispatch Paused (Night Mode)'}
          </p>
          <p className={`text-xs ${isDispatchAllowed() ? 'text-emerald-600' : 'text-amber-600'}`}>
            {getDispatchTimeMessage()} · Auto-dispatch at {AI_DISPATCH_THRESHOLD}+ reports per location
          </p>
        </div>
        {nearbyHotspot.length > 0 && (
          <div className="flex items-center gap-1.5 bg-red-100 text-red-700 px-3 py-1.5 rounded-xl flex-shrink-0">
            <Zap className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">{nearbyHotspot.length} Active</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatsCard title="My Reports" value={stats.total}      icon={FileText}   color="blue" />
        <StatsCard title="Pending"    value={stats.pending}    icon={Clock}      color="amber" />
        <StatsCard title="Dispatched" value={stats.dispatched} icon={Truck}      color="emerald" />
        <StatsCard title="Resolved"   value={stats.resolved}   icon={CheckCircle} color="green" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports Feed */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
              Reports in {user?.ward?.split('–')[1]?.trim() || 'Your Area'}
            </h2>
            <Link to="/my-reports" className="text-sm text-[hsl(158,64%,32%)] hover:underline font-medium">
              View Mine →
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
            {filterTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filter === tab.key
                    ? 'gradient-brand text-white shadow-sm'
                    : 'bg-white border border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {displayReports.length === 0 ? (
              <div className="text-center py-14 bg-white border border-border rounded-2xl">
                <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground font-semibold">No reports found</p>
                <p className="text-sm text-muted-foreground/70 mt-1 mb-4">Be the first to report an issue in your area</p>
                <Link to="/report" className="inline-flex items-center gap-2 px-4 py-2 gradient-brand text-white rounded-xl text-sm font-semibold">
                  <Plus className="w-4 h-4" /> File Report
                </Link>
              </div>
            ) : (
              displayReports.slice(0, 6).map(r => (
                <ReportCard key={r.id} report={r} onUpvote={upvoteReport} />
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <LocationHeatmap reports={reports} />

          {dispatches.length > 0 && (
            <div className="bg-white border border-border rounded-2xl p-5">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                <Truck className="w-4 h-4 text-[hsl(158,64%,32%)]" />
                Recent Dispatches
              </h3>
              <div className="space-y-2.5">
                {dispatches.slice(0, 3).map(d => (
                  <div key={d.id} className={`p-3 rounded-xl border ${d.status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-emerald-50 border-emerald-200'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-foreground">{d.truckId}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${d.status === 'completed' ? 'bg-green-200 text-green-800' : 'bg-emerald-200 text-emerald-800'}`}>
                        {d.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{d.area} · {d.driverName}</p>
                    {d.aiInitiated && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">
                        <Bot className="w-2.5 h-2.5" /> AI Dispatched
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
