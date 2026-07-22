import { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: 'green' | 'amber' | 'blue' | 'red' | 'purple' | 'emerald';
  trend?: { value: number; label: string };
}

const colorMap = {
  green:   { bg: 'bg-white', icon: 'bg-green-100 text-green-600',   value: 'text-green-700',   border: 'border-green-200' },
  amber:   { bg: 'bg-white', icon: 'bg-amber-100 text-amber-600',   value: 'text-amber-700',   border: 'border-amber-200' },
  blue:    { bg: 'bg-white', icon: 'bg-blue-100 text-blue-600',     value: 'text-blue-700',    border: 'border-blue-200' },
  red:     { bg: 'bg-white', icon: 'bg-red-100 text-red-600',       value: 'text-red-700',     border: 'border-red-200' },
  purple:  { bg: 'bg-white', icon: 'bg-purple-100 text-purple-600', value: 'text-purple-700',  border: 'border-purple-200' },
  emerald: { bg: 'bg-white', icon: 'bg-emerald-100 text-emerald-600', value: 'text-emerald-700', border: 'border-emerald-200' },
};

export default function StatsCard({ title, value, subtitle, icon: Icon, color, trend }: Props) {
  const c = colorMap[color];
  return (
    <div className={`${c.bg} border ${c.border} rounded-2xl p-5 hover:shadow-md transition-all duration-200`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 ${c.icon} rounded-xl flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend.value >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
            {trend.value >= 0 ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <p className={`text-3xl font-extrabold ${c.value} mb-1`} style={{ fontFamily: 'Sora, sans-serif' }}>{value}</p>
      <p className="text-sm font-semibold text-foreground leading-tight">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
  );
}
