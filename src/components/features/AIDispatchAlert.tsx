import { useEffect, useState } from 'react';
import { Bot, Truck, MapPin, Clock, X, Zap } from 'lucide-react';
import { DispatchEvent } from '@/types';

interface Props {
  dispatch: DispatchEvent;
  onClose: () => void;
}

export default function AIDispatchAlert({ dispatch, onClose }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 100);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 400);
    }, 9000);
    return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
  }, [onClose]);

  const eta = new Date(dispatch.estimatedArrival);
  const etaMins = Math.max(5, Math.round((eta.getTime() - Date.now()) / 60000));

  return (
    <div className={`fixed top-20 right-4 z-[100] w-96 max-w-[calc(100vw-32px)] transition-all duration-500 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}>
      <div className="bg-white border-2 border-emerald-400 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="gradient-brand px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full flex items-center justify-center">
                <Zap className="w-2 h-2 text-white" />
              </span>
            </div>
            <div>
              <p className="text-white font-bold text-sm">AI Dispatch Triggered!</p>
              <p className="text-emerald-200 text-xs">{dispatch.reportCount} reports threshold reached</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center ai-glow flex-shrink-0">
              <Truck className="w-5 h-5 text-[hsl(158,64%,32%)] truck-bounce" />
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">{dispatch.truckId}</p>
              <p className="text-xs text-muted-foreground">Driver: {dispatch.driverName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/50 rounded-xl px-3 py-2.5 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[hsl(158,64%,32%)] flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground">Location</p>
                <p className="text-xs font-semibold text-foreground truncate">{dispatch.area}</p>
              </div>
            </div>
            <div className="bg-muted/50 rounded-xl px-3 py-2.5 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground">ETA</p>
                <p className="text-xs font-semibold text-foreground">{etaMins} mins</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5">
            <div className="relative w-2 h-2 flex-shrink-0">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <div className="absolute inset-0 bg-emerald-500 rounded-full pulse-ring" />
            </div>
            <p className="text-xs text-emerald-700 font-medium">Garbage truck is now en route</p>
          </div>
        </div>

        {/* Auto-dismiss progress bar */}
        <div className="h-1 bg-emerald-100">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
            style={{ animation: 'shrinkBar 9s linear forwards' }}
          />
        </div>
      </div>

      <style>{`
        @keyframes shrinkBar {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
