import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await resetPassword(token, password);
      setMessage(res.message || 'Password reset');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl ring-1 ring-white/10"
      >
        <h2 className="mb-4 text-2xl font-semibold text-white">Reset password</h2>
        {error && <p className="mb-3 rounded bg-red-500/10 p-2 text-sm text-red-100 ring-1 ring-red-500/30">{error}</p>}
        {message && <p className="mb-3 rounded bg-emerald-500/10 p-2 text-sm text-emerald-100 ring-1 ring-emerald-500/30">{message}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-200">New password</label>
            <input
              type="password"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-sky-400/70 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-sky-500 px-4 py-2 text-white shadow-lg shadow-sky-500/30 hover:bg-sky-400 disabled:opacity-60"
          >
            {loading ? 'Resetting...' : 'Reset password'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
