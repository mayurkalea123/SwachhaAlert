import { useState, useCallback } from 'react';
import { GarbageReport, DispatchEvent } from '@/types';
import { getStoredReports, setStoredReports, getStoredDispatches, addReport } from '@/lib/store';

export function useReports() {
  const [reports, setReports] = useState<GarbageReport[]>(getStoredReports);
  const [dispatches, setDispatches] = useState<DispatchEvent[]>(getStoredDispatches);

  const submitReport = useCallback((reportData: Omit<GarbageReport, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'upvotes' | 'aiTriggered'>) => {
    const newReport: GarbageReport = {
      ...reportData,
      id: `r_${Date.now()}`,
      status: 'pending',
      upvotes: 0,
      aiTriggered: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = addReport(newReport);
    setReports(result.reports);
    setDispatches(getStoredDispatches());
    return result;
  }, []);

  const updateReportStatus = useCallback((reportId: string, status: GarbageReport['status']) => {
    const updated = reports.map(r =>
      r.id === reportId
        ? { ...r, status, updatedAt: new Date().toISOString(), resolvedAt: status === 'resolved' ? new Date().toISOString() : r.resolvedAt }
        : r
    );
    setStoredReports(updated);
    setReports(updated);
  }, [reports]);

  const upvoteReport = useCallback((reportId: string) => {
    const updated = reports.map(r =>
      r.id === reportId ? { ...r, upvotes: r.upvotes + 1, updatedAt: new Date().toISOString() } : r
    );
    setStoredReports(updated);
    setReports(updated);
  }, [reports]);

  const refreshReports = useCallback(() => {
    setReports(getStoredReports());
    setDispatches(getStoredDispatches());
  }, []);

  return { reports, dispatches, submitReport, updateReportStatus, upvoteReport, refreshReports };
}
