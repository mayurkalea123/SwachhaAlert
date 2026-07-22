export type UserRole = 'citizen' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  ward?: string;
  avatar?: string;
  reportsCount?: number;
  joinedAt: string;
}

export type ReportStatus = 'pending' | 'acknowledged' | 'dispatched' | 'resolved' | 'rejected';
export type WasteType = 'household' | 'construction' | 'medical' | 'electronic' | 'organic' | 'hazardous';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface GarbageReport {
  id: string;
  userId: string;
  userName: string;
  userPhone?: string;
  location: string;
  ward: string;
  area: string;
  coordinates?: { lat: number; lng: number };
  wasteType: WasteType;
  description: string;
  imageUrl?: string;
  status: ReportStatus;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  aiTriggered?: boolean;
  dispatchedAt?: string;
  resolvedAt?: string;
  upvotes: number;
}

export interface DispatchEvent {
  id: string;
  locationKey: string;
  ward: string;
  area: string;
  reportCount: number;
  triggerReports: string[];
  dispatchedAt: string;
  truckId: string;
  driverName: string;
  estimatedArrival: string;
  status: 'en-route' | 'arrived' | 'completed';
  aiInitiated: boolean;
}

export interface WardStats {
  ward: string;
  totalReports: number;
  pending: number;
  resolved: number;
  dispatched: number;
  aiDispatches: number;
}

export interface Notification {
  id: string;
  type: 'dispatch' | 'resolved' | 'upvote' | 'status' | 'ai';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  reportId?: string;
}
