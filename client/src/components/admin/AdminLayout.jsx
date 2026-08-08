import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  BookOpen,
  Bell,
  Users,
  CalendarDays,
  Quote,
  Images,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  FileText,
  ChevronDown,
  Menu,
  X,
  Eye,
  FolderKanban,
  Sparkles,
  HelpCircle,
  FileDown,
  Handshake,
  UserCog,
  MessageSquareText,
  Database,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// Grouped, collapsible sidebar navigation — mirrors how most professional
// admin panels (Shopify, WordPress, etc.) organize a growing list of screens
// into logical categories instead of one long flat list.
const navGroups = [
  {
    items: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    ],
  },
  {
    label: "Content",
    icon: FolderKanban,
    items: [
      { to: "/admin/blog", label: "Blog Posts", icon: FileText },
      { to: "/admin/notices", label: "Notice Board", icon: Bell },
      { to: "/admin/downloads", label: "Downloads", icon: FileDown },
      { to: "/admin/gallery", label: "Gallery", icon: Images },
    ],
  },
  {
    label: "Academics",
    icon: BookOpen,
    items: [
      { to: "/admin/courses", label: "Courses & Subjects", icon: BookOpen },
      {
        to: "/admin/academics",
        label: "Non-Credit Courses & Workshops",
        icon: Sparkles,
      },
      { to: "/admin/faculty", label: "Faculty", icon: Users },
    ],
  },
  {
    label: "Community",
    icon: Users,
    items: [
      { to: "/admin/events", label: "Events", icon: CalendarDays },
      { to: "/admin/testimonials", label: "Testimonials", icon: Quote },
      {
        to: "/admin/placement-partners",
        label: "Placement Partners",
        icon: Handshake,
      },
    ],
  },
  {
    label: "Messages",
    icon: Mail,
    items: [
      { to: "/admin/messages", label: "Inquiries", icon: Mail },
      { to: "/admin/faq", label: "FAQs (Chat Widget)", icon: HelpCircle },
      { to: "/admin/live-chat", label: "Live Chat", icon: MessageSquareText },
      { to: "/admin/knowledge-base", label: "Knowledge Base", icon: Database },
    ],
  },
  {
    label: "Site Configuration",
    icon: Settings,
    items: [
      {
        to: "/admin/visibility",
        label: "Page & Section Visibility",
        icon: Eye,
      },
      { to: "/admin/settings", label: "Site Settings", icon: Settings },
      { to: "/admin/users", label: "User Management", icon: UserCog },
    ],
  },
];

function isGroupActive(group, pathname) {
  return group.items.some((item) =>
    item.end ? pathname === item.to : pathname.startsWith(item.to),
  );
}

function SidebarContent({ onNavigate }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [openGroups, setOpenGroups] = useState(() =>
    Object.fromEntries(
      navGroups.map((g) => [
        g.label,
        !g.label || isGroupActive(g, location.pathname),
      ]),
    ),
  );

  useEffect(() => {
    setOpenGroups(() => {
      const active = navGroups.find(
        (g) => g.label && isGroupActive(g, location.pathname),
      );
      return Object.fromEntries(
        navGroups
          .filter((g) => g.label)
          .map((g) => [g.label, active ? g.label === active.label : false]),
      );
    });
  }, [location.pathname]);

  function toggleGroup(label) {
    setOpenGroups((prev) => {
      const willOpen = !prev[label];
      // Accordion behavior: only one group open at a time. Collapse every
      // other group and set this one to the toggled state.
      const next = Object.fromEntries(
        navGroups.filter((g) => g.label).map((g) => [g.label, false]),
      );
      next[label] = willOpen;
      return next;
    });
  }

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  // Enhanced active item styling + smooth hover transition + shadow glow
  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out ${
      isActive
        ? "bg-marigold-400 text-navy-950 font-semibold shadow-sm shadow-marigold-400/20"
        : "text-navy-100/80 hover:text-white hover:bg-white/[0.08]"
    }`;

  return (
    <div className="flex flex-col h-full bg-navy-800">
      {/* Header */}
      <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between shrink-0">
        <div>
          <p className="font-display text-lg leading-tight text-white tracking-wide">
            Swastik College
          </p>
          <p className="text-xs text-navy-200/80">Admin Control Panel</p>
        </div>
        <button
          onClick={onNavigate}
          className="lg:hidden text-navy-200 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav List with Thin/Modern Scrollbar & Polished Spacing */}
      <nav className="flex-1 overflow-y-auto custom-sidebar-scrollbar py-4 px-3 space-y-3">
        {navGroups.map((group) => {
          // Ungrouped top-level items (e.g. Dashboard)
          if (!group.label) {
            return (
              <div key="ungrouped" className="space-y-1">
                {group.items.map(({ to, label, icon: Icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={onNavigate}
                    className={linkClass}
                  >
                    <Icon size={18} className="shrink-0" />
                    <span className="truncate">{label}</span>
                  </NavLink>
                ))}
              </div>
            );
          }

          const open = openGroups[group.label];
          const GroupIcon = group.icon;
          return (
            <div key={group.label} className="space-y-1">
              {/* Polished Group Header */}
              <button
                onClick={() => toggleGroup(group.label)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 text-[11px] font-bold tracking-wider uppercase text-navy-300/80 hover:text-white transition-colors group"
              >
                <span className="flex items-center gap-2.5">
                  <GroupIcon
                    size={14}
                    className="text-navy-300/70 group-hover:text-white transition-colors"
                  />
                  <span>{group.label}</span>
                </span>
                {/* Smoother Chevron Rotation */}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ease-in-out text-navy-300/70 group-hover:text-white ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Smooth Height-Transition Accordion */}
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  {/* Submenu Guide Line */}
                  <div className="ml-4 pl-3 border-l border-white/10 space-y-1 my-1">
                    {group.items.map(({ to, label, icon: Icon, end }) => (
                      <NavLink
                        key={to}
                        to={to}
                        end={end}
                        onClick={onNavigate}
                        className={linkClass}
                      >
                        <Icon size={17} className="shrink-0" />
                        <span className="truncate">{label}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1 shrink-0 bg-navy-800">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-navy-100/80 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
        >
          <ExternalLink size={18} className="shrink-0" />
          <span>View live site</span>
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-navy-100/80 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
        >
          <LogOut size={18} className="shrink-0" />
          <span>Log out</span>
        </button>
        <div className="pt-2 px-3 text-xs text-navy-300/70 truncate font-mono">
          {admin?.name} · {admin?.role}
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { admin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="h-screen flex bg-paper overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-navy-800 text-white flex-col h-full border-r border-white/5">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-navy-800 text-white flex flex-col shadow-2xl h-full">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="bg-white border-b border-navy-100 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-navy-600 hover:text-navy-900 transition-colors"
          >
            <Menu size={22} />
          </button>
          <p className="text-sm text-navy-500 hidden sm:block">Signed in as</p>
          <p className="text-sm font-semibold text-navy-800 truncate">
            {admin?.name} · {admin?.role}
          </p>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
