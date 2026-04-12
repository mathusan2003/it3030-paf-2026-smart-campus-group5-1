import { useState, useEffect } from 'react';
import {
  Settings,
  Calendar,
  Ticket,
  Bell,
  Users,
  Shield,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Zap,
  BarChart3,
  Clock,
  CheckCircle,
  Menu,
  X,
} from 'lucide-react';
import AuthModal from '../components/Auth/AuthModal';

const features = [
  {
    icon: BookOpen,
    title: 'Resource Booking',
    description: 'Browse and reserve campus rooms, labs, and equipment in real time. No more double bookings or scheduling conflicts.',
    color: 'bg-[#0EA5E9]/10 text-[#0EA5E9]',
  },
  {
    icon: Ticket,
    title: 'Support Tickets',
    description: 'Report facility issues, equipment faults, or maintenance needs. Track progress from submission to resolution.',
    color: 'bg-[#10B981]/10 text-[#10B981]',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Receive instant alerts for booking confirmations, ticket updates, and critical campus announcements.',
    color: 'bg-[#F59E0B]/10 text-[#F59E0B]',
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    description: 'Tailored dashboards for students, administrators, and technicians — everyone sees exactly what they need.',
    color: 'bg-[#EF4444]/10 text-[#EF4444]',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reports',
    description: 'Administrators get real-time insights into resource utilization, ticket trends, and campus activity.',
    color: 'bg-[#8B5CF6]/10 text-[#8B5CF6]',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security with row-level data protection ensuring only authorized users access sensitive data.',
    color: 'bg-[#06B6D4]/10 text-[#06B6D4]',
  },
];

const stats = [
  { value: '5,000+', label: 'Active Students' },
  { value: '120+', label: 'Campus Resources' },
  { value: '98%', label: 'Uptime SLA' },
  { value: '<2h', label: 'Avg. Ticket Resolution' },
];

const howItWorks = [
  {
    step: '01',
    title: 'Create Your Account',
    description: 'Register with your campus email and select your role — student, administrator, or technician.',
    icon: Users,
  },
  {
    step: '02',
    title: 'Explore Resources',
    description: 'Browse available rooms, labs, and equipment. Check availability and book instantly.',
    icon: BookOpen,
  },
  {
    step: '03',
    title: 'Manage & Track',
    description: 'Monitor your bookings, submit support tickets, and stay on top of campus updates.',
    icon: CheckCircle,
  },
];

const testimonials = [
  {
    quote: "Campus Hub transformed how we manage our facilities. Booking conflicts are down 90% since launch.",
    name: "Dr. Sarah Chen",
    role: "Campus Administrator",
    initials: "SC",
    color: "bg-[#0EA5E9]",
  },
  {
    quote: "I can book a study room in under 30 seconds. No more walking across campus only to find it occupied.",
    name: "Marcus Johnson",
    role: "Engineering Student",
    initials: "MJ",
    color: "bg-[#10B981]",
  },
  {
    quote: "The ticket system keeps me organised. I know exactly which issues are assigned to me and their priority.",
    name: "Tony Rivera",
    role: "Facilities Technician",
    initials: "TR",
    color: "bg-[#F59E0B]",
  },
];

export default function LandingPage() {
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'login' | 'register' }>({
    open: false,
    mode: 'login',
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openLogin = () => setAuthModal({ open: true, mode: 'login' });
  const openRegister = () => setAuthModal({ open: true, mode: 'register' });

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header / Nav */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0EA5E9] rounded-xl flex items-center justify-center shadow-lg shadow-[#0EA5E9]/20">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <span className={`font-bold text-lg transition-colors ${scrolled ? 'text-[#111827]' : 'text-white'}`}>
              Campus Hub
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {['Features', 'How It Works', 'Testimonials'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className={`text-sm font-medium transition-colors hover:text-[#0EA5E9] ${scrolled ? 'text-[#374151]' : 'text-white/80 hover:text-white'}`}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={openLogin}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${scrolled ? 'text-[#374151] hover:text-[#0EA5E9]' : 'text-white/90 hover:text-white'}`}
            >
              Sign In
            </button>
            <button
              onClick={openRegister}
              className="px-4 py-2 text-sm font-semibold bg-[#0EA5E9] text-white rounded-xl hover:bg-[#0284C7] transition-colors shadow-lg shadow-[#0EA5E9]/20"
            >
              Get Started
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(s => !s)}
            className={`md:hidden transition-colors ${scrolled ? 'text-[#374151]' : 'text-white'}`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-4">
            {['Features', 'How It Works', 'Testimonials'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-[#374151] hover:text-[#0EA5E9]"
              >
                {item}
              </a>
            ))}
            <div className="flex gap-3 pt-2">
              <button onClick={openLogin} className="flex-1 py-2 text-sm font-semibold border border-gray-200 rounded-xl text-[#374151] hover:border-[#0EA5E9] hover:text-[#0EA5E9] transition-colors">
                Sign In
              </button>
              <button onClick={openRegister} className="flex-1 py-2 text-sm font-semibold bg-[#0EA5E9] text-white rounded-xl hover:bg-[#0284C7] transition-colors">
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#050914] via-[#0B1220] to-[#050914]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9]/10 via-transparent to-[#10B981]/8" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0EA5E9]/6 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#06B6D4]/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#10B981]/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full mb-8 backdrop-blur-sm">
              <Zap className="w-4 h-4 text-[#0EA5E9]" />
              <span className="text-white/80 text-sm font-medium">Smart Campus Operations Platform</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Manage Your Campus{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4]">
                Smarter
              </span>
            </h1>

            <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-xl">
              One unified platform for booking resources, managing support tickets, and keeping your entire campus community connected and informed.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={openRegister}
                className="flex items-center gap-2 px-7 py-3.5 bg-[#0EA5E9] text-white font-semibold rounded-xl hover:bg-[#0284C7] transition-all shadow-xl shadow-[#0EA5E9]/30 hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={openLogin}
                className="flex items-center gap-2 px-7 py-3.5 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm"
              >
                Sign In
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-6 mt-12">
              {['No credit card required', 'Free to join', 'Instant access'].map(item => (
                <div key={item} className="flex items-center gap-1.5 text-white/60 text-sm">
                  <CheckCircle className="w-4 h-4 text-[#10B981]" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-white text-sm font-medium">Resource Overview</p>
                    <p className="text-white/50 text-xs">Live Campus Status</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
                    <span className="text-white/60 text-xs">Live</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { label: 'Rooms Available', value: '24', icon: Calendar, color: 'text-[#0EA5E9]', bg: 'bg-[#0EA5E9]/10' },
                    { label: 'Active Bookings', value: '147', icon: CheckCircle, color: 'text-[#10B981]', bg: 'bg-[#10B981]/10' },
                    { label: 'Open Tickets', value: '8', icon: Ticket, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
                    { label: 'Avg Wait', value: '1.8h', icon: Clock, color: 'text-[#06B6D4]', bg: 'bg-[#06B6D4]/10' },
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="bg-white/5 rounded-xl p-4">
                        <div className={`w-8 h-8 ${item.bg} rounded-lg flex items-center justify-center mb-3`}>
                          <Icon className={`w-4 h-4 ${item.color}`} />
                        </div>
                        <p className="text-white font-bold text-xl">{item.value}</p>
                        <p className="text-white/50 text-xs mt-0.5">{item.label}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-2">
                  {[
                    { name: 'Conference Room A', status: 'available', time: 'Available now' },
                    { name: 'Computer Lab B', status: 'busy', time: 'Occupied until 3 PM' },
                    { name: 'Study Room 101', status: 'available', time: 'Available now' },
                  ].map(room => (
                    <div key={room.name} className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-2.5">
                      <span className="text-white/80 text-sm">{room.name}</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${room.status === 'available' ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`} />
                        <span className={`text-xs ${room.status === 'available' ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                          {room.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-[#10B981] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                Real-time updates
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#0F172A] border-t border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-white/50 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0EA5E9]/10 rounded-full mb-4">
              <span className="text-[#0EA5E9] text-sm font-medium">Platform Features</span>
            </div>
            <h2 className="text-4xl font-bold text-[#111827] mb-4">
              Everything your campus needs
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              A comprehensive suite of tools designed to streamline operations and improve the daily experience for every member of your campus community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description, color }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-5`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-[#111827] font-semibold text-lg mb-3 group-hover:text-[#0EA5E9] transition-colors">
                  {title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#10B981]/10 rounded-full mb-4">
              <span className="text-[#10B981] text-sm font-medium">Simple Process</span>
            </div>
            <h2 className="text-4xl font-bold text-[#111827] mb-4">Up and running in minutes</h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              No complex setup or training required. Your campus community can start using Campus Hub right away.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-[#0EA5E9] to-[#10B981]" />
            {howItWorks.map(({ step, title, description, icon: Icon }, index) => (
              <div key={step} className="relative flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-[#0EA5E9]/20 relative z-10">
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 md:top-0 md:right-auto md:left-16 w-6 h-6 bg-[#0F172A] text-white text-xs font-bold rounded-full flex items-center justify-center z-20">
                  {index + 1}
                </div>
                <h3 className="text-[#111827] font-bold text-xl mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button
              onClick={openRegister}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0EA5E9] text-white font-semibold rounded-xl hover:bg-[#0284C7] transition-all shadow-xl shadow-[#0EA5E9]/20 hover:scale-105"
            >
              Start for Free
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F59E0B]/10 rounded-full mb-4">
              <span className="text-[#F59E0B] text-sm font-medium">User Stories</span>
            </div>
            <h2 className="text-4xl font-bold text-[#111827] mb-4">Loved by the entire campus</h2>
            <p className="text-gray-500 text-lg">Hear from the students, staff, and technicians who use Campus Hub every day.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ quote, name, role, initials, color }) => (
              <div key={name} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-[#F59E0B] fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">"{quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${color} rounded-full flex items-center justify-center`}>
                    <span className="text-white text-sm font-semibold">{initials}</span>
                  </div>
                  <div>
                    <p className="text-[#111827] font-semibold text-sm">{name}</p>
                    <p className="text-gray-400 text-xs">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#0F172A] to-[#0EA5E9]/20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0EA5E9]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#06B6D4]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to transform your campus?
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of students and staff already using Campus Hub to simplify their daily operations. It's free to get started.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={openRegister}
              className="flex items-center gap-2 px-8 py-4 bg-[#0EA5E9] text-white font-semibold rounded-xl hover:bg-[#0284C7] transition-all shadow-xl shadow-[#0EA5E9]/30 hover:scale-105"
            >
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={openLogin}
              className="flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm"
            >
              Sign In to Your Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#0EA5E9] rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold">Campus Hub</span>
            </div>
            <p className="text-white/30 text-sm text-center">
              Smart Campus Operations Hub &mdash; Connecting students, staff, and resources seamlessly.
            </p>
            <div className="flex items-center gap-6 text-white/40 text-sm">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Support</span>
            </div>
          </div>
        </div>
      </footer>

      {authModal.open && (
        <AuthModal
          initialMode={authModal.mode}
          onClose={() => setAuthModal(s => ({ ...s, open: false }))}
        />
      )}
    </div>
  );
}
