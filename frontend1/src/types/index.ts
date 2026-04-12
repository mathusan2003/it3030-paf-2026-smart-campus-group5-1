export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'administrator' | 'technician';
  avatar?: string;
}

export interface Resource {
  id: string;
  name: string;
  type: string;
  location: string;
  capacity: number;
  available: boolean;
  image?: string;
}

export interface Booking {
  id: string;
  resourceId: string;
  resourceName: string;
  userId: string;
  userName: string;
  startTime: Date;
  endTime: Date;
  status: 'pending' | 'approved' | 'rejected';
  purpose: string;
  createdAt: Date;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  assignedTo?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  attachments?: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: User['role']) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}