import { MapPin, Clock, ThumbsUp, Bot, Truck, AlertTriangle, CheckCircle, XCircle, Eye } from 'lucide-react';
import { GarbageReport } from '@/types';
import { formatDistanceToNow } from '@/lib/utils';

interface Props {
  report: GarbageReport;
  onUpvote?: (id: string) => void;
  onStatusChange?: (id: string, status: GarbageReport['status']) => void;
  isAdmin?: boolean;
  onClick?: () => void;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending:      { label: 'Pending',      color: 'text-amber-700 bg-amber-100',   icon: Clock },
  acknowledged: { label: 'Acknowledged', color: 'text-blue-700 bg-blue-100',     icon: Eye },
  dispatched:   { label: 'Dispatched',   color: 'text-emerald-700 bg-emerald-100', icon: Truck },
  resolved:     { label: 'Resolved',     color: 'text-green-700 bg-green-100',   icon: CheckCircle },
  rejected:     { label: 'Rejected',     color: 'text-red-700 bg-red-100',       icon: XCircle },
};

const wasteColors: Record<string, string> = {
  household:    'bg-gray-100 text-gray-700',
  construction: 'bg-orange-100 text-orange-700',
  medical:      'bg-red-100 text-red-700',
  electronic:   'bg-purple-100 text-purple-700',
  organic:      'bg-lime-100 text-lime-700',
  hazardous:    'bg-rose-100 text-rose-800',
};

const wasteEmoji: Record<string, string> = {
  household: '🏠', construction: '🏗', medical: '🏥',
  electronic: '📱', organic: '🌿', hazardous: '⚠️',
};

const priorityBorderMap: Record<string, string> = {
  low:      'border-l-gray-300',
  medium:   'border-l-amber-400',
  high:     'border-l-orange-500',
  critical: 'border-l-red-600',
};

export default function ReportCard({ report, onUpvote, onStatusChange, isAdmin, onClick }: Props) {
  const status = statusConfig[report.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div
      className={`bg-white border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 border-l-4 ${priorityBorderMap[report.priority]} group ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Image */}
      {report.imageUrl && (
        <div className="h-40 overflow-hidden">
          <img src={report.imageUrl} alt="Garbage report" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      )}

      <div className="p-4">
        {/* Badges row */}
        <div className="flex items-center gap-1.5 flex-wrap mb-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${wasteColors[report.wasteType]}`}>
            <span>{wasteEmoji[report.wasteType]}</span>
            {report.wasteType}
          </span>
          {report.priority === 'critical' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-bold">
              <AlertTriangle className="w-3 h-3" />
              Critical
            </span>
          )}
          {report.aiTriggered && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
              <Bot className="w-3 h-3" />
              AI
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2 mb-2">{report.description}</p>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
          <MapPin className="w-3.5 h-3.5 text-[hsl(158,64%,32%)] flex-shrink-0" />
          <span className="truncate">{report.location}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-6 h-6 gradient-brand rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              {report.userName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{report.userName}</p>
              <p className="text-[10px] text-muted-foreground">{formatDistanceToNow(report.createdAt)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Status badge */}
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${status.color}`}>
              <StatusIcon className="w-3 h-3" />
              <span className="hidden sm:inline">{status.label}</span>
            </div>

            {/* Upvote */}
            {onUpvote && (
              <button
                onClick={(e) => { e.stopPropagation(); onUpvote(report.id); }}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors text-muted-foreground hover:text-emerald-600 min-w-[44px] justify-center"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">{report.upvotes}</span>
              </button>
            )}

            {/* Admin status changer */}
            {isAdmin && onStatusChange && (
              <select
                onClick={(e) => e.stopPropagation()}
                value={report.status}
                onChange={(e) => { e.stopPropagation(); onStatusChange(report.id, e.target.value as GarbageReport['status']); }}
                className="text-xs border border-border rounded-lg px-2 py-1.5 bg-white text-foreground cursor-pointer focus:ring-2 focus:ring-[hsl(158,64%,32%)] outline-none"
              >
                <option value="pending">Pending</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="dispatched">Dispatched</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
