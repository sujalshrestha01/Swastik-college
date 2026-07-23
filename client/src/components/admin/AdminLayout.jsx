import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Bell, Users, CalendarDays, Quote, Images, Mail, Settings, LogOut, ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/courses', label: 'Courses & Subjects', icon: BookOpen },
  { to: '/admin/notices', label: 'Notice Board', icon: Bell },
  { to: '/admin/faculty', label: 'Faculty', icon: Users },
  { to: '/admin/events', label: 'Events', icon: CalendarDays },
  { to: '/admin/testimonials', label: 'Testimonials', icon: Quote },
  { to: '/admin/gallery', label: 'Gallery', icon: Images },
  { to: '/admin/messages', label: 'Inquiries', icon: Mail },
  { to: '/admin/settings', label: 'Site Settings', icon: Settings },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  return (
    <div className="min-h-screen flex bg-paper">
      <aside className="w-64 shrink-0 bg-navy-800 text-white flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <p className="font-display text-lg leading-tight">Swastik College</p>
          <p className="text-xs text-navy-200">Admin Control Panel</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive ? 'bg-marigold-400 text-navy-900 font-semibold' : 'text-navy-100 hover:bg-white/10'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-navy-100 hover:bg-white/10"
          >
            <ExternalLink size={17} /> View live site
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-navy-100 hover:bg-white/10"
          >
            <LogOut size={17} /> Log out
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-navy-100 px-6 py-3 flex items-center justify-between">
          <p className="text-sm text-navy-500">Signed in as</p>
          <p className="text-sm font-semibold text-navy-800">{admin?.name} · {admin?.role}</p>
        </header>
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
