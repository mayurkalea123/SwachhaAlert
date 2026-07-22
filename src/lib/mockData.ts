import { GarbageReport, DispatchEvent, User, WardStats, Notification } from '@/types';

export const WARDS = [
  'Ward 1 – Koramangala', 'Ward 2 – Indiranagar', 'Ward 3 – Jayanagar',
  'Ward 4 – Whitefield', 'Ward 5 – Hebbal', 'Ward 6 – Electronic City',
  'Ward 7 – BTM Layout', 'Ward 8 – Marathahalli', 'Ward 9 – Yelahanka',
  'Ward 10 – JP Nagar'
];

export const AREAS_BY_WARD: Record<string, string[]> = {
  'Ward 1 – Koramangala': ['5th Block', '6th Block', '7th Block', 'Koramangala Circle'],
  'Ward 2 – Indiranagar': ['100 Feet Road', '12th Main', 'CMH Road', 'HAL 2nd Stage'],
  'Ward 3 – Jayanagar': ['4th Block', '9th Block', 'South End Circle', 'Ashoka Pillar'],
  'Ward 4 – Whitefield': ['ITPL Road', 'Varthur Road', 'Hoodi', 'Nallurhalli'],
  'Ward 5 – Hebbal': ['Nagawara Ring Road', 'Outer Ring Road', 'Dollars Colony', 'Thanisandra'],
  'Ward 6 – Electronic City': ['Phase 1', 'Phase 2', 'Neeladri Road', 'Neelankanahalli'],
  'Ward 7 – BTM Layout': ['1st Stage', '2nd Stage', 'Madiwala', 'Dairy Circle'],
  'Ward 8 – Marathahalli': ['Bridge', 'Outer Ring Road', 'Kundalahalli', 'Doddakannelli'],
  'Ward 9 – Yelahanka': ['New Town', 'Old Town', 'Attur Layout', 'Sahakar Nagar'],
  'Ward 10 – JP Nagar': ['1st Phase', '3rd Phase', '7th Phase', 'Arekere'],
};

export const WASTE_TYPES = ['household', 'construction', 'medical', 'electronic', 'organic', 'hazardous'];

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();

export const mockReports: GarbageReport[] = [
  {
    id: 'r001', userId: 'u001', userName: 'Arjun Sharma', userPhone: '+91 98765 43210',
    location: 'Near 5th Block Park, Koramangala', ward: 'Ward 1 – Koramangala', area: '5th Block',
    wasteType: 'household', description: 'Large pile of mixed garbage dumped near the park entrance. Foul smell affecting residents.',
    status: 'dispatched', priority: 'high', createdAt: hoursAgo(3), updatedAt: hoursAgo(1),
    aiTriggered: true, dispatchedAt: hoursAgo(1), upvotes: 14,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80'
  },
  {
    id: 'r002', userId: 'u002', userName: 'Priya Nair', userPhone: '+91 87654 32109',
    location: 'Koramangala 5th Block Main Road', ward: 'Ward 1 – Koramangala', area: '5th Block',
    wasteType: 'organic', description: 'Rotting vegetables and food waste dumped on the roadside.',
    status: 'dispatched', priority: 'high', createdAt: hoursAgo(4), updatedAt: hoursAgo(1),
    aiTriggered: true, dispatchedAt: hoursAgo(1), upvotes: 9,
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&q=80'
  },
  {
    id: 'r003', userId: 'u003', userName: 'Ravi Kumar',
    location: '5th Block Junction, Koramangala', ward: 'Ward 1 – Koramangala', area: '5th Block',
    wasteType: 'construction', description: 'Construction debris blocking the footpath completely.',
    status: 'acknowledged', priority: 'medium', createdAt: hoursAgo(5), updatedAt: hoursAgo(2),
    aiTriggered: true, upvotes: 7,
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80'
  },
  {
    id: 'r004', userId: 'u004', userName: 'Meena Reddy',
    location: 'Park Road, Koramangala 5th Block', ward: 'Ward 1 – Koramangala', area: '5th Block',
    wasteType: 'household', description: 'Plastic waste and garbage bags overflowing from bins.',
    status: 'acknowledged', priority: 'medium', createdAt: hoursAgo(6), updatedAt: hoursAgo(3),
    aiTriggered: true, upvotes: 5,
  },
  {
    id: 'r005', userId: 'u005', userName: 'Suresh Rao',
    location: '5th Block Bus Stop, Koramangala', ward: 'Ward 1 – Koramangala', area: '5th Block',
    wasteType: 'electronic', description: 'Old computers and electronic waste dumped near bus stop.',
    status: 'pending', priority: 'high', createdAt: hoursAgo(7), updatedAt: hoursAgo(7),
    aiTriggered: true, upvotes: 11,
  },
  {
    id: 'r006', userId: 'u006', userName: 'Lakshmi S.',
    location: '100 Feet Road, Indiranagar', ward: 'Ward 2 – Indiranagar', area: '100 Feet Road',
    wasteType: 'household', description: 'Garbage not collected for 3 days. Bins overflowing.',
    status: 'pending', priority: 'medium', createdAt: hoursAgo(8), updatedAt: hoursAgo(8),
    aiTriggered: false, upvotes: 3,
  },
  {
    id: 'r007', userId: 'u007', userName: 'Deepak M.',
    location: '12th Main Indiranagar', ward: 'Ward 2 – Indiranagar', area: '12th Main',
    wasteType: 'organic', description: 'Food stalls dumping waste near the footpath.',
    status: 'resolved', priority: 'low', createdAt: daysAgo(2), updatedAt: daysAgo(1),
    resolvedAt: daysAgo(1), aiTriggered: false, upvotes: 2,
  },
  {
    id: 'r008', userId: 'u008', userName: 'Aishwarya P.',
    location: 'Jayanagar 4th Block', ward: 'Ward 3 – Jayanagar', area: '4th Block',
    wasteType: 'hazardous', description: 'Chemical drums illegally dumped in open area. Dangerous!',
    status: 'pending', priority: 'critical', createdAt: hoursAgo(2), updatedAt: hoursAgo(2),
    aiTriggered: false, upvotes: 18,
  },
  {
    id: 'r009', userId: 'u009', userName: 'Vijay T.',
    location: 'Whitefield ITPL Road', ward: 'Ward 4 – Whitefield', area: 'ITPL Road',
    wasteType: 'construction', description: 'Rubble blocking half the road near tech park.',
    status: 'acknowledged', priority: 'high', createdAt: hoursAgo(10), updatedAt: hoursAgo(5),
    aiTriggered: false, upvotes: 6,
  },
  {
    id: 'r010', userId: 'u010', userName: 'Kavya R.',
    location: 'Hebbal Ring Road', ward: 'Ward 5 – Hebbal', area: 'Nagawara Ring Road',
    wasteType: 'household', description: 'Overflowing public bins near flyover.',
    status: 'resolved', priority: 'low', createdAt: daysAgo(3), updatedAt: daysAgo(2),
    resolvedAt: daysAgo(2), aiTriggered: false, upvotes: 1,
  },
  {
    id: 'r011', userId: 'u001', userName: 'Arjun Sharma',
    location: 'BTM Layout 2nd Stage', ward: 'Ward 7 – BTM Layout', area: '2nd Stage',
    wasteType: 'medical', description: 'Hospital waste improperly disposed near residential area.',
    status: 'pending', priority: 'critical', createdAt: hoursAgo(1), updatedAt: hoursAgo(1),
    aiTriggered: false, upvotes: 22,
  },
  {
    id: 'r012', userId: 'u011', userName: 'Sanjay B.',
    location: 'Marathahalli Bridge', ward: 'Ward 8 – Marathahalli', area: 'Bridge',
    wasteType: 'household', description: 'Waste dumped under the bridge. Flooding risk.',
    status: 'pending', priority: 'high', createdAt: hoursAgo(12), updatedAt: hoursAgo(12),
    aiTriggered: false, upvotes: 8,
  },
];

export const mockDispatches: DispatchEvent[] = [
  {
    id: 'd001',
    locationKey: 'Ward 1 – Koramangala|5th Block',
    ward: 'Ward 1 – Koramangala',
    area: '5th Block',
    reportCount: 5,
    triggerReports: ['r001', 'r002', 'r003', 'r004', 'r005'],
    dispatchedAt: hoursAgo(1),
    truckId: 'KA-01-GV-3421',
    driverName: 'Ramesh Kumar',
    estimatedArrival: new Date(now.getTime() + 20 * 60000).toISOString(),
    status: 'en-route',
    aiInitiated: true,
  },
  {
    id: 'd002',
    locationKey: 'Ward 3 – Jayanagar|4th Block',
    ward: 'Ward 3 – Jayanagar',
    area: '4th Block',
    reportCount: 7,
    triggerReports: ['r008'],
    dispatchedAt: daysAgo(1),
    truckId: 'KA-01-GV-2211',
    driverName: 'Sunil Verma',
    estimatedArrival: daysAgo(1),
    status: 'completed',
    aiInitiated: true,
  },
];

export const mockUsers: User[] = [
  { id: 'u001', name: 'Arjun Sharma', email: 'arjun@example.com', role: 'citizen', phone: '+91 98765 43210', ward: 'Ward 1 – Koramangala', reportsCount: 8, joinedAt: daysAgo(60) },
  { id: 'u002', name: 'Priya Nair', email: 'priya@example.com', role: 'citizen', phone: '+91 87654 32109', ward: 'Ward 1 – Koramangala', reportsCount: 5, joinedAt: daysAgo(45) },
  { id: 'u003', name: 'Ravi Kumar', email: 'ravi@example.com', role: 'citizen', ward: 'Ward 1 – Koramangala', reportsCount: 3, joinedAt: daysAgo(30) },
  { id: 'u004', name: 'Meena Reddy', email: 'meena@example.com', role: 'citizen', ward: 'Ward 1 – Koramangala', reportsCount: 4, joinedAt: daysAgo(20) },
  { id: 'u005', name: 'Suresh Rao', email: 'suresh@example.com', role: 'citizen', ward: 'Ward 2 – Indiranagar', reportsCount: 2, joinedAt: daysAgo(15) },
  { id: 'admin1', name: 'Pooja Krishnamurthy', email: 'admin@swachha.gov.in', role: 'admin', ward: 'All Wards', reportsCount: 0, joinedAt: daysAgo(180) },
];

export const mockWardStats: WardStats[] = [
  { ward: 'Ward 1 – Koramangala', totalReports: 5, pending: 2, resolved: 0, dispatched: 2, aiDispatches: 1 },
  { ward: 'Ward 2 – Indiranagar', totalReports: 2, pending: 1, resolved: 1, dispatched: 0, aiDispatches: 0 },
  { ward: 'Ward 3 – Jayanagar', totalReports: 1, pending: 1, resolved: 0, dispatched: 0, aiDispatches: 0 },
  { ward: 'Ward 4 – Whitefield', totalReports: 1, pending: 0, resolved: 0, dispatched: 1, aiDispatches: 0 },
  { ward: 'Ward 5 – Hebbal', totalReports: 1, pending: 0, resolved: 1, dispatched: 0, aiDispatches: 0 },
  { ward: 'Ward 7 – BTM Layout', totalReports: 1, pending: 1, resolved: 0, dispatched: 0, aiDispatches: 0 },
  { ward: 'Ward 8 – Marathahalli', totalReports: 1, pending: 1, resolved: 0, dispatched: 0, aiDispatches: 0 },
];

export const mockNotifications: Notification[] = [
  { id: 'n001', type: 'ai', title: 'AI Dispatch Triggered!', message: 'Garbage truck KA-01-GV-3421 dispatched to Koramangala 5th Block due to 5+ reports.', read: false, createdAt: hoursAgo(1), reportId: 'r001' },
  { id: 'n002', type: 'dispatch', title: 'Truck En Route', message: 'Estimated arrival at your reported location: 20 minutes.', read: false, createdAt: hoursAgo(1), reportId: 'r001' },
  { id: 'n003', type: 'status', title: 'Report Acknowledged', message: 'Your report at BTM Layout has been acknowledged by the admin.', read: true, createdAt: hoursAgo(3), reportId: 'r011' },
  { id: 'n004', type: 'upvote', title: 'Report Upvoted!', message: '22 citizens have upvoted your report at BTM Layout.', read: true, createdAt: hoursAgo(2) },
];

export const AI_DISPATCH_THRESHOLD = 5;

export function checkAIDispatch(reports: GarbageReport[]): Map<string, GarbageReport[]> {
  const locationMap = new Map<string, GarbageReport[]>();

  reports.forEach(report => {
    if (report.status === 'pending' || report.status === 'acknowledged') {
      const key = `${report.ward}|${report.area}`;
      const existing = locationMap.get(key) || [];
      locationMap.set(key, [...existing, report]);
    }
  });

  const dispatchNeeded = new Map<string, GarbageReport[]>();
  locationMap.forEach((rpts, key) => {
    if (rpts.length >= AI_DISPATCH_THRESHOLD) {
      dispatchNeeded.set(key, rpts);
    }
  });

  return dispatchNeeded;
}

export function isDispatchAllowed(): boolean {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 21;
}

export function getDispatchTimeMessage(): string {
  const hour = new Date().getHours();
  if (hour >= 21 || hour < 6) {
    const nextMorning = new Date();
    if (hour >= 21) nextMorning.setDate(nextMorning.getDate() + 1);
    nextMorning.setHours(6, 0, 0, 0);
    const diff = nextMorning.getTime() - Date.now();
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return `Dispatch scheduled for 6:00 AM (in ${hrs}h ${mins}m)`;
  }
  return 'Dispatch available now (6 AM – 9 PM)';
}
