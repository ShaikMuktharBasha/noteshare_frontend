import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-900/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Link to="/" className="text-xl font-bold text-sky-300">
            NoteShare
          </Link>
        </motion.div>
        <nav className="flex items-center gap-4 text-sm font-medium text-slate-200">
          <NavLink to="/notes" className={({ isActive }) => (isActive ? 'text-sky-600' : '')}>
            Notes
          </NavLink>
          {user && (
            <>
              <NavLink to="/upload" className={({ isActive }) => (isActive ? 'text-sky-600' : '')}>
                Upload
              </NavLink>
              <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'text-sky-600' : '')}>
                Dashboard
              </NavLink>
              {user.role === 'admin' && (
                <NavLink to="/admin" className={({ isActive }) => (isActive ? 'text-sky-600' : '')}>
                  Admin
                </NavLink>
              )}
            </>
          )}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <span className="rounded-full bg-white/10 px-3 py-1 text-sky-100 shadow-sm ring-1 ring-white/10">
                {user.name}
              </span>
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="rounded bg-sky-600 px-3 py-1 text-white shadow-sm hover:bg-sky-500"
                onClick={logout}
              >
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-100">
                Login
              </Link>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/register"
                  className="rounded bg-sky-500 px-3 py-1 text-white shadow-sm hover:bg-sky-400"
                >
                  Register
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
