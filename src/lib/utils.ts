import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDistanceToNow(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit'
  });
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    pending: 'text-amber-700 bg-amber-100',
    acknowledged: 'text-blue-700 bg-blue-100',
    dispatched: 'text-emerald-700 bg-emerald-100',
    resolved: 'text-green-700 bg-green-100',
    rejected: 'text-red-700 bg-red-100',
    'en-route': 'text-blue-700 bg-blue-100',
    arrived: 'text-emerald-700 bg-emerald-100',
    completed: 'text-green-700 bg-green-100',
  };
  return map[status] || 'text-gray-700 bg-gray-100';
}
