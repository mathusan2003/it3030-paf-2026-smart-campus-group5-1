import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import BookingListPage from './legacy-booking/BookingListPage';
import Resources from './pages/Resources';
import Tickets from './pages/Tickets';
import Notifications from './pages/Notifications';
import Users from './pages/Users';
import Reports from './pages/Reports';
import AssignedTickets from './pages/AssignedTickets';
import CompletedTasks from './pages/CompletedTasks';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-[#0EA5E9] rounded-xl animate-spin mx-auto mb-4"></div>
          <p className="text-white/50 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/landing" element={<LandingPage />} />
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />}
      />
      <Route element={user ? <Layout /> : <Navigate to="/" replace />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/bookings" element={<BookingListPage />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/tickets-assigned" element={<AssignedTickets />} />
        <Route path="/tasks-completed" element={<CompletedTasks />} />
        <Route path="/users" element={<Users />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppContent />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#374151',
                color: '#F3F4F6',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '14px',
                maxWidth: '400px',
              },
              success: {
                style: {
                  background: '#10B981',
                  color: 'white',
                },
                iconTheme: {
                  primary: 'white',
                  secondary: '#10B981',
                },
              },
              error: {
                style: {
                  background: '#EF4444',
                  color: 'white',
                },
                iconTheme: {
                  primary: 'white',
                  secondary: '#EF4444',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;