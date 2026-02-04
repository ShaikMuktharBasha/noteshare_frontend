import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { FileText, Upload, LayoutDashboard, Settings, LogOut, FolderLock } from 'lucide-react';

const linkBase = 'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { to: '/notes', label: 'Notes', icon: FileText },
    { to: '/upload', label: 'Upload', auth: true, icon: Upload },
    { to: '/dashboard', label: 'Dashboard', auth: true, icon: LayoutDashboard },
    { to: '/my-docs', label: 'My Docs', auth: true, icon: FolderLock },
  ];

  if (user?.role === 'admin') {
    navItems.push({ to: '/admin', label: 'Admin', icon: Settings });
  }

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 z-30 flex h-full w-64 flex-col border-r border-white/[0.08] bg-slate-900/60 backdrop-blur-xl"
    >
      {/* Logo */}
      <div className="px-6 py-5">
        <Link to="/notes" className="group flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-cyan-300 shadow-lg shadow-sky-500/25">
            <span className="text-lg font-bold text-slate-900">N</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Note<span className="text-sky-400">Share</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-2">
        <p className="mb-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Menu</p>
        {navItems
          .filter((item) => !item.auth || user)
          .map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `${linkBase} ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-300 shadow-sm shadow-sky-500/10'
                      : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                  }`
                }
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
      </nav>

      {/* User section */}
      <div className="border-t border-white/[0.06] px-4 py-4">
        {user ? (
          <div className="space-y-3">
            {/* User info - minimal & classy */}
            <div className="flex items-center gap-3 rounded-xl px-3 py-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-600 text-sm font-semibold uppercase text-white shadow-inner">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-white">{user.name}</p>
                <p className="text-[11px] text-slate-500 capitalize">{user.role}</p>
              </div>
            </div>

            {/* Logout button - red glassy */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={logout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 backdrop-blur-sm transition-all hover:border-red-500/40 hover:bg-red-500/20 hover:text-red-300 hover:shadow-lg hover:shadow-red-500/10"
            >
              <LogOut size={16} strokeWidth={1.8} />
              Sign out
            </motion.button>
          </div>
        ) : (
          <div className="space-y-2">
            <Link
              className="block rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2.5 text-center text-sm font-semibold text-slate-900 shadow-lg shadow-sky-500/25 transition hover:shadow-sky-500/40"
              to="/login"
            >
              Sign in
            </Link>
            <Link
              className="block rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-center text-sm font-medium text-slate-300 backdrop-blur transition hover:border-white/20 hover:bg-white/[0.06]"
              to="/register"
            >
              Create account
            </Link>
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
