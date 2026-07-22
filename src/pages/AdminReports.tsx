import { useState } from 'react';
import { Search, Bot, AlertTriangle, FileText } from 'lucide-react';
import { useReports } from '@/hooks/useReports';
import ReportCard from '@/components/features/ReportCard';
import { WARDS } from '@/lib/mockData';

export default function AdminReports() {
  const { reports, updateReportStatus, upvoteReport } = useReports();
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [wardFilter, setWardFilter]     = useState('all');
  const [sortBy, setSortBy]             = useState<'newest' | 'upvotes' | 'priority'>('newest');

  const filtered = reports
    .filter(r => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (wardFilter   !== 'all' && r.ward   !== wardFilter)   return false;
      if (search && !r.location.toLowerCase().includes(search.toLowerCase()) &&
          !r.description.toLowerCase().includes(search.toLowerCase()) &&
          !r.userName.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest')   return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'upvotes')  return b.upvotes - a.upvotes;
      const prio: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
      return (prio[b.priority] || 0) - (prio[a.priority] || 0);
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>All Reports</h1>
          <p className="text-muted-foreground text-sm mt-1">{filtered.length} of {reports.length} reports</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-xl text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" />
            {reports.filter(r => r.priority === 'critical' && r.status === 'pending').length} Critical
          </div>
          <div className="flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1.5 rounded-xl text-xs font-semibold">
            <Bot className="w-3.5 h-3.5" />
            {reports.filter(r => r.aiTriggered).length} AI Triggered
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-border rounded-2xl p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search location, reporter…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm focus:ring-2 focus:ring-[hsl(158,64%,32%)] outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 border border-border rounded-xl text-sm focus:ring-2 focus:ring-[hsl(158,64%,32%)] outline-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="dispatched">Dispatched</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={wardFilter}
            onChange={e => setWardFilter(e.target.value)}
            className="px-3 py-2.5 border border-border rounded-xl text-sm focus:ring-2 focus:ring-[hsl(158,64%,32%)] outline-none bg-white"
          >
            <option value="all">All Wards</option>
            {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-3 py-2.5 border border-border rounded-xl text-sm focus:ring-2 focus:ring-[hsl(158,64%,32%)] outline-none bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="upvotes">Most Upvoted</option>
            <option value="priority">Highest Priority</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-border rounded-2xl">
          <FileText className="w-14 h-14 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-bold text-foreground mb-2">No Reports Found</h3>
          <p className="text-muted-foreground text-sm">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(r => (
            <ReportCard
              key={r.id}
              report={r}
              onStatusChange={updateReportStatus}
              onUpvote={upvoteReport}
              isAdmin
            />
          ))}
        </div>
      )}
    </div>
  );
}
