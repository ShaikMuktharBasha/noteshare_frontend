import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import TextType from '../components/TextType.jsx';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid min-h-[80vh] max-w-5xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-4"
      >
        <p className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-semibold text-slate-100 ring-1 ring-white/10">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(52,211,153,0.15)]" />
          Secure access
        </p>
        <h1 className="text-4xl font-bold text-white">Welcome back.</h1>
        <div className="text-lg text-slate-200/80">
          <TextType
            text={["Welcome to Notes Share Site", "Upload. Organize. Collaborate.", "Happy learning!"]}
            typingSpeed={75}
            pauseDuration={1500}
            deletingSpeed={50}
            cursorCharacter="_"
            cursorBlinkDuration={0.5}
          />
        </div>
        <p className="max-w-xl text-slate-300">
          Sign in to access your notes, favorites, and admin tools. Keep your study materials in one fast, secure place.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl ring-1 ring-white/10"
      >
        <h2 className="mb-4 text-2xl font-semibold text-white">Login</h2>
        {error && <p className="mb-3 rounded bg-red-500/10 p-2 text-sm text-red-100 ring-1 ring-red-500/30">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-200">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-sky-400/70 focus:outline-none"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-200">Password</label>
            <input
              type="password"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-sky-400/70 focus:outline-none"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-sky-500 px-4 py-2 text-white shadow-lg shadow-sky-500/30 hover:bg-sky-400 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <p className="mt-3 text-sm text-slate-300">
          No account?{' '}
          <Link className="text-sky-300" to="/register">
            Register
          </Link>
        </p>
        <p className="mt-2 text-sm">
          <Link className="text-sky-300" to="/forgot-password">
            Forgot password?
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
