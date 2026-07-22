import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useReports } from '@/hooks/useReports';
import ReportCard from '@/components/features/ReportCard';

export default function MyReports() {
  const { user } = useAuth();
  const { reports, upvoteReport } = useReports();
  const [filter, setFilter] = useState('all');

  const myReports = reports.filter(r => r.userId === user?.id);
  const filtered  = myReports.filter(r => filter === 'all' || r.status === filter);

  const tabs = [
    { key: 'all',        label: `All (${myReports.length})` },
    { key: 'pending',    label: `Pending (${myReports.filter(r => r.status === 'pending').length})` },
    { key: 'dispatched', label: `Dispatched (${myReports.filter(r => r.status === 'dispatched').length})` },
    { key: 'resolved',   label: `Resolved (${myReports.filter(r => r.status === 'resolved').length})` },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>My Reports</h1>
          <p className="text-muted-foreground text-sm mt-1">{myReports.length} total reports filed by you</p>
        </div>
        <Link
          to="/report"
          className="inline-flex items-center gap-2 px-4 py-2.5 gradient-brand text-white font-semibold rounded-xl hover:opacity-90 transition-all text-sm shadow-md"
        >
          <Plus className="w-4 h-4" />
          New Report
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              filter === t.key
                ? 'gradient-brand text-white shadow-sm'
                : 'bg-white border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-border rounded-2xl">
          <FileText className="w-14 h-14 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-bold text-foreground mb-2">No Reports Found</h3>
          <p className="text-muted-foreground text-sm mb-5">
            {filter === 'all' ? "You haven't filed any reports yet." : `No ${filter} reports found.`}
          </p>
          <Link
            to="/report"
            className="inline-flex items-center gap-2 px-5 py-2.5 gradient-brand text-white rounded-xl text-sm font-semibold shadow-md"
          >
            <Plus className="w-4 h-4" />
            File First Report
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(r => (
            <ReportCard key={r.id} report={r} onUpvote={upvoteReport} />
          ))}
        </div>
      )}
    </div>
  );
}
