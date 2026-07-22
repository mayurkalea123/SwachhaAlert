import { Bot, Truck, MapPin, Clock, CheckCircle, Zap } from 'lucide-react';
import { useReports } from '@/hooks/useReports';
import { formatDateTime, formatDistanceToNow } from '@/lib/utils';
import { isDispatchAllowed, getDispatchTimeMessage } from '@/lib/store';

export default function AdminDispatches() {
  const { dispatches, reports } = useReports();

  const active    = dispatches.filter(d => d.status !== 'completed');
  const completed = dispatches.filter(d => d.status === 'completed');

  const DispatchCard = ({ dispatch }: { dispatch: typeof dispatches[0] }) => {
    const eta = new Date(dispatch.estimatedArrival);
    const etaMins = Math.max(0, Math.round((eta.getTime() - Date.now()) / 60000));
    const triggerReports = reports.filter(r => dispatch.triggerReports.includes(r.id));
    const isDone = dispatch.status === 'completed';

    return (
      <div className={`bg-white border-2 rounded-2xl overflow-hidden ${isDone ? 'border-green-200' : 'border-emerald-300'}`}>
        {/* Card Header */}
        <div className={`px-5 py-4 ${isDone ? 'bg-green-50' : 'bg-emerald-50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDone ? 'bg-green-100' : 'bg-emerald-100'}`}>
                <Truck className={`w-5 h-5 ${isDone ? 'text-green-600' : 'text-emerald-600 truck-bounce'}`} />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">{dispatch.truckId}</p>
                <p className="text-xs text-muted-foreground">{dispatch.driverName}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                isDone
                  ? 'bg-green-200 text-green-800'
                  : dispatch.status === 'arrived'
                    ? 'bg-emerald-200 text-emerald-800'
                    : 'bg-blue-200 text-blue-800'
              }`}>
                {dispatch.status === 'en-route' ? '🚛 En Route' : dispatch.status === 'arrived' ? '✅ Arrived' : '✔ Completed'}
              </span>
              {dispatch.aiInitiated && (
                <span className="flex items-center gap-1 text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold">
                  <Bot className="w-2.5 h-2.5" /> AI
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="px-5 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[hsl(158,64%,32%)] flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground">Location</p>
                <p className="text-xs font-semibold text-foreground truncate">{dispatch.area}</p>
                <p className="text-[10px] text-muted-foreground truncate">{dispatch.ward.split('–')[0].trim()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground">{isDone ? 'Completed' : 'ETA'}</p>
                <p className="text-xs font-semibold text-foreground">
                  {isDone ? formatDistanceToNow(dispatch.estimatedArrival) : `${etaMins} mins`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <p className="text-xs font-semibold text-foreground">{dispatch.reportCount} reports triggered this dispatch</p>
          </div>

          {/* Trigger Reports */}
          {triggerReports.length > 0 && (
            <div className="bg-muted/40 rounded-xl p-3">
              <p className="text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-wide">Triggered By</p>
              <div className="space-y-1.5">
                {triggerReports.slice(0, 3).map(r => (
                  <div key={r.id} className="flex items-center gap-2">
                    <div className="w-5 h-5 gradient-brand rounded-full flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0">
                      {r.userName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-foreground truncate">{r.description}</p>
                      <p className="text-[9px] text-muted-foreground">{r.userName} · {formatDistanceToNow(r.createdAt)}</p>
                    </div>
                  </div>
                ))}
                {triggerReports.length > 3 && (
                  <p className="text-[10px] text-muted-foreground">+{triggerReports.length - 3} more</p>
                )}
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground">Dispatched: {formatDateTime(dispatch.dispatchedAt)}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>Dispatch Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Track all garbage truck dispatches in real time</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${isDispatchAllowed() ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          <Bot className="w-4 h-4" />
          {isDispatchAllowed() ? getDispatchTimeMessage() : getDispatchTimeMessage()}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-blue-200 rounded-2xl p-4 text-center">
          <p className="text-2xl font-extrabold text-blue-600" style={{ fontFamily: 'Sora, sans-serif' }}>{active.length}</p>
          <p className="text-sm font-semibold text-foreground mt-0.5">Active</p>
        </div>
        <div className="bg-white border border-green-200 rounded-2xl p-4 text-center">
          <p className="text-2xl font-extrabold text-green-600" style={{ fontFamily: 'Sora, sans-serif' }}>{completed.length}</p>
          <p className="text-sm font-semibold text-foreground mt-0.5">Completed</p>
        </div>
        <div className="bg-white border border-purple-200 rounded-2xl p-4 text-center">
          <p className="text-2xl font-extrabold text-purple-600" style={{ fontFamily: 'Sora, sans-serif' }}>{dispatches.filter(d => d.aiInitiated).length}</p>
          <p className="text-sm font-semibold text-foreground mt-0.5">AI Initiated</p>
        </div>
      </div>

      {/* Active Dispatches */}
      {active.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2" style={{ fontFamily: 'Sora, sans-serif' }}>
            <div className="relative w-2 h-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <div className="absolute inset-0 bg-emerald-500 rounded-full pulse-ring" />
            </div>
            Active Dispatches ({active.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {active.map(d => <DispatchCard key={d.id} dispatch={d} />)}
          </div>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div>
          <h2 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2" style={{ fontFamily: 'Sora, sans-serif' }}>
            <CheckCircle className="w-5 h-5 text-green-500" />
            Completed ({completed.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completed.map(d => <DispatchCard key={d.id} dispatch={d} />)}
          </div>
        </div>
      )}

      {dispatches.length === 0 && (
        <div className="text-center py-16 bg-white border border-border rounded-2xl">
          <Truck className="w-14 h-14 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-bold text-foreground mb-2">No Dispatches Yet</h3>
          <p className="text-muted-foreground text-sm">Dispatches appear here once the AI threshold is reached.</p>
        </div>
      )}
    </div>
  );
}
