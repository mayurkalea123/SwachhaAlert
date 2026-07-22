import { User, GarbageReport, DispatchEvent, Notification } from '@/types';
import { mockReports, mockUsers, mockDispatches, mockNotifications, checkAIDispatch, isDispatchAllowed, AI_DISPATCH_THRESHOLD } from '@/lib/mockData';

const STORAGE_KEYS = {
  USER: 'swachha_user',
  REPORTS: 'swachha_reports',
  DISPATCHES: 'swachha_dispatches',
  NOTIFICATIONS: 'swachha_notifications',
};

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function setStoredUser(user: User | null) {
  if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_KEYS.USER);
}

export function getStoredReports(): GarbageReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return raw ? JSON.parse(raw) : mockReports;
  } catch { return mockReports; }
}

export function setStoredReports(reports: GarbageReport[]) {
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
}

export function getStoredDispatches(): DispatchEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DISPATCHES);
    return raw ? JSON.parse(raw) : mockDispatches;
  } catch { return mockDispatches; }
}

export function setStoredDispatches(dispatches: DispatchEvent[]) {
  localStorage.setItem(STORAGE_KEYS.DISPATCHES, JSON.stringify(dispatches));
}

export function getStoredNotifications(): Notification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return raw ? JSON.parse(raw) : mockNotifications;
  } catch { return mockNotifications; }
}

export function setStoredNotifications(notifs: Notification[]) {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
}

export function addReport(report: GarbageReport): { reports: GarbageReport[], dispatched: boolean, dispatchInfo?: DispatchEvent } {
  const reports = getStoredReports();
  const updated = [report, ...reports];

  const dispatchMap = checkAIDispatch(updated);
  const key = `${report.ward}|${report.area}`;

  let dispatchInfo: DispatchEvent | undefined;
  let dispatchTriggered = false;

  if (dispatchMap.has(key) && isDispatchAllowed()) {
    const dispatches = getStoredDispatches();
    const alreadyDispatched = dispatches.some(d =>
      d.locationKey === key && d.status !== 'completed'
    );

    if (!alreadyDispatched) {
      const triggerReports = dispatchMap.get(key)!;

      updated.forEach(r => {
        if (r.ward === report.ward && r.area === report.area &&
          (r.status === 'pending' || r.status === 'acknowledged')) {
          r.status = 'dispatched';
          r.aiTriggered = true;
          r.dispatchedAt = new Date().toISOString();
        }
      });

      const driverNames = ['Ramesh Kumar', 'Sunil Verma', 'Mahesh Patil', 'Ajay Singh', 'Vinod Joshi'];
      dispatchInfo = {
        id: `d${Date.now()}`,
        locationKey: key,
        ward: report.ward,
        area: report.area,
        reportCount: triggerReports.length,
        triggerReports: triggerReports.map(r => r.id),
        dispatchedAt: new Date().toISOString(),
        truckId: `KA-01-GV-${Math.floor(1000 + Math.random() * 8999)}`,
        driverName: driverNames[Math.floor(Math.random() * driverNames.length)],
        estimatedArrival: new Date(Date.now() + (15 + Math.floor(Math.random() * 20)) * 60000).toISOString(),
        status: 'en-route',
        aiInitiated: true,
      };

      dispatches.push(dispatchInfo);
      setStoredDispatches(dispatches);
      dispatchTriggered = true;

      const notifs = getStoredNotifications();
      notifs.unshift({
        id: `n${Date.now()}`,
        type: 'ai',
        title: '🤖 AI Dispatch Triggered!',
        message: `Truck ${dispatchInfo.truckId} dispatched to ${report.area}, ${report.ward}. ETA: 15–20 mins.`,
        read: false,
        createdAt: new Date().toISOString(),
        reportId: report.id,
      });
      setStoredNotifications(notifs);
    }
  }

  setStoredReports(updated);
  return { reports: updated, dispatched: dispatchTriggered, dispatchInfo };
}

export function loginUser(email: string, password: string): User | null {
  const credentials: Record<string, { password: string; userId: string }> = {
    'admin@swachha.gov.in': { password: 'admin123', userId: 'admin1' },
    'arjun@example.com': { password: 'citizen123', userId: 'u001' },
    'priya@example.com': { password: 'citizen123', userId: 'u002' },
  };

  const cred = credentials[email.toLowerCase()];
  if (!cred || cred.password !== password) return null;

  const user = mockUsers.find(u => u.id === cred.userId);
  if (!user) return null;

  setStoredUser(user);
  return user;
}

export function registerUser(name: string, email: string, password: string, phone: string, ward: string): User {
  const newUser: User = {
    id: `u_${Date.now()}`,
    name,
    email,
    role: 'citizen',
    phone,
    ward,
    reportsCount: 0,
    joinedAt: new Date().toISOString(),
  };
  setStoredUser(newUser);
  return newUser;
}

export { AI_DISPATCH_THRESHOLD, isDispatchAllowed, getDispatchTimeMessage } from '@/lib/mockData';
