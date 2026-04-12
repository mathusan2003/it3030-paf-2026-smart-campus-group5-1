import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'smart-campus-auth-user';
const CUSTOM_USERS_KEY = 'smart-campus-custom-users';

interface StoredAccount {
  password: string;
  user: User;
}

function readCustomUsers(): Record<string, StoredAccount> {
  try {
    const raw = localStorage.getItem(CUSTOM_USERS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, StoredAccount>) : {};
  } catch {
    return {};
  }
}

function writeCustomUsers(map: Record<string, StoredAccount>) {
  localStorage.setItem(CUSTOM_USERS_KEY, JSON.stringify(map));
}

const DEMO_USERS: Record<string, StoredAccount> = {
  'student@campus.edu': {
    password: 'password123',
    user: {
      id: 'student-1',
      name: 'Student User',
      email: 'student@campus.edu',
      role: 'student',
    },
  },
  'admin@campus.edu': {
    password: 'password123',
    user: {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@campus.edu',
      role: 'administrator',
    },
  },
  'tech@campus.edu': {
    password: 'password123',
    user: {
      id: 'tech-1',
      name: 'Technician User',
      email: 'tech@campus.edu',
      role: 'technician',
    },
  },
  'tech2@campus.edu': {
    password: 'password123',
    user: {
      id: 'tech-2',
      name: 'Technician Two',
      email: 'tech2@campus.edu',
      role: 'technician',
    },
  },
  'tech3@campus.edu': {
    password: 'password123',
    user: {
      id: 'tech-3',
      name: 'Technician Three',
      email: 'tech3@campus.edu',
      role: 'technician',
    },
  },
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setUser(JSON.parse(raw) as User);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const key = email.toLowerCase().trim();
    const custom = readCustomUsers();
    const account = DEMO_USERS[key] ?? custom[key];
    if (!account || account.password !== password) {
      toast.error('Invalid email or password');
      throw new Error('Invalid credentials');
    }
    setUser(account.user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(account.user));
    toast.success('Welcome back!');
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: User['role']
  ): Promise<void> => {
    const key = email.toLowerCase().trim();
    if (DEMO_USERS[key]) {
      toast.error('This email is reserved for demo accounts');
      throw new Error('reserved');
    }
    const custom = readCustomUsers();
    if (custom[key]) {
      toast.error('An account with this email already exists');
      throw new Error('exists');
    }
    const id = `user-${Date.now()}`;
    const newUser: User = { id, name, email: key, role };
    custom[key] = { password, user: newUser };
    writeCustomUsers(custom);
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    toast.success(`Account created! Welcome, ${name}!`);
  };

  const logout = async (): Promise<void> => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
