import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderLock, Upload, FileText, Trash2, Download, X, Search, Filter, Lock, Key, Shield, RefreshCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/api.js';
import { getFileUrl } from '../utils/fileUrl.js';

const categories = ['All', 'Resume', 'ID Proof', 'Certificate', 'Financial', 'Medical', 'Other'];

const PersonalDocsPage = () => {
  const { user, updateUser } = useAuth();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false); // Changed from true to false, will load after unlock
  const [isLocked, setIsLocked] = useState(true);
  const [securityMode, setSecurityMode] = useState('loading'); // loading | unlock | setup | reset
  const [securityInput, setSecurityInput] = useState('');
  const [resetInput, setResetInput] = useState({ accountPassword: '', newDocsPassword: '' });
  const [securityError, setSecurityError] = useState('');
  const [securityLoading, setSecurityLoading] = useState(false);
  
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [form, setForm] = useState({ title: '', description: '', category: 'Other', file: null });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setSecurityMode(user.hasDocsPassword ? 'unlock' : 'setup');
    }
  }, [user]);

  useEffect(() => {
    if (!isLocked) {
      setLoading(true);
      fetchDocs();
    }
  }, [isLocked]);

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    setSecurityError('');
    setSecurityLoading(true);

    try {
      if (securityMode === 'unlock') {
        await api.post('/auth/docs-password/verify', { password: securityInput });
        setIsLocked(false);
        setSecurityInput('');
      } else if (securityMode === 'setup') {
        if (securityInput.length < 4) throw new Error('Password must be at least 4 characters');
        await api.post('/auth/docs-password/set', { password: securityInput });
        updateUser({ hasDocsPassword: true });
        setIsLocked(false);
        setSecurityInput('');
      } else if (securityMode === 'reset') {
        if (resetInput.newDocsPassword.length < 4) throw new Error('New password must be at least 4 characters');
        await api.post('/auth/docs-password/reset', resetInput);
        updateUser({ hasDocsPassword: true });
        setIsLocked(false);
        setResetInput({ accountPassword: '', newDocsPassword: '' });
        setSecurityMode('unlock'); // Reset to default state
      }
    } catch (err) {
      setSecurityError(err.response?.data?.message || err.message || 'Operation failed');
    } finally {
      setSecurityLoading(false);
    }
  };

  const fetchDocs = async () => {
    try {
      const { data } = await api.get('/personal-docs');
      setDocs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!form.file || !form.title.trim()) {
      setError('Title and file are required');
      return;
    }
    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('category', form.category);
    formData.append('file', form.file);

    try {
      const { data } = await api.post('/personal-docs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setDocs((prev) => [data, ...prev]);
      setForm({ title: '', description: '', category: 'Other', file: null });
      setShowUpload(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this document permanently?')) return;
    try {
      await api.delete(`/personal-docs/${id}`);
      setDocs((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredDocs = docs.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'All' || doc.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (cat) => {
    const colors = {
      Resume: 'bg-emerald-500/20 text-emerald-300 ring-emerald-500/30',
      'ID Proof': 'bg-blue-500/20 text-blue-300 ring-blue-500/30',
      Certificate: 'bg-amber-500/20 text-amber-300 ring-amber-500/30',
      Financial: 'bg-purple-500/20 text-purple-300 ring-purple-500/30',
      Medical: 'bg-rose-500/20 text-rose-300 ring-rose-500/30',
      Other: 'bg-slate-500/20 text-slate-300 ring-slate-500/30',
    };
    return colors[cat] || colors.Other;
  };

  if (isLocked) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl"
        >
          <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 p-6 text-center border-b border-white/5">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 shadow-lg">
              {securityMode === 'setup' ? <Key className="h-8 w-8 text-emerald-400" /> : 
               securityMode === 'reset' ? <RefreshCcw className="h-8 w-8 text-amber-400" /> :
               <Lock className="h-8 w-8 text-violet-400" />}
            </div>
            <h2 className="text-xl font-bold text-white">
              {securityMode === 'setup' ? 'Set Personal Password' : 
               securityMode === 'reset' ? 'Reset Docs Password' : 
               'Protected Storage'}
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              {securityMode === 'setup' ? 'Create a secure password for your personal documents.' : 
               securityMode === 'reset' ? 'Enter your account password to set a new docs password.' :
               'Please enter your password to access your documents.'}
            </p>
          </div>

          <div className="p-6">
            {securityError && (
              <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-200 ring-1 ring-red-500/20">
                {securityError}
              </div>
            )}

            <form onSubmit={handleSecuritySubmit} className="space-y-4">
              {securityMode === 'reset' ? (
                <>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Account Password</label>
                    <input
                      type="password"
                      value={resetInput.accountPassword}
                      onChange={(e) => setResetInput({...resetInput, accountPassword: e.target.value})}
                      className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-slate-600 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition"
                      placeholder="Your main login password"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">New Docs Password</label>
                    <input
                      type="password"
                      value={resetInput.newDocsPassword}
                      onChange={(e) => setResetInput({...resetInput, newDocsPassword: e.target.value})}
                      className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-slate-600 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition"
                      placeholder="New secure docs password"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <input
                    type="password"
                    value={securityInput}
                    onChange={(e) => setSecurityInput(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-center text-lg tracking-widest text-white placeholder-slate-600 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition"
                    placeholder={securityMode === 'setup' ? "Create Password" : "Enter Password"}
                    autoFocus
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={securityLoading}
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 py-3 font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:shadow-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {securityLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Processing...
                  </span>
                ) : (
                  securityMode === 'setup' ? 'Set Password' : 
                  securityMode === 'reset' ? 'Reset Password' :
                  'Unlock Documents'
                )}
              </button>
            </form>

            {securityMode === 'unlock' && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setSecurityMode('reset')}
                  className="text-sm text-slate-400 hover:text-white transition-colors underline decoration-slate-600 underline-offset-4 hover:decoration-white"
                >
                  Forgot Docs Password?
                </button>
              </div>
            )}
            
            {securityMode === 'reset' && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setSecurityMode('unlock')}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Back to Unlock
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25">
            <FolderLock size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">My Documents</h1>
            <p className="text-sm text-slate-400">Private & secure storage</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:shadow-violet-500/40"
        >
          <Upload size={18} />
          Upload Document
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-violet-400/50 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-violet-400/50 focus:outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-slate-800">
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocs.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur">
          <FolderLock size={48} className="mx-auto mb-4 text-slate-500" />
          <p className="text-lg font-medium text-white">No documents yet</p>
          <p className="mt-1 text-sm text-slate-400">Upload your first private document</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredDocs.map((doc) => (
              <motion.div
                key={doc._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-violet-500/30 hover:bg-white/[0.07]"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/20">
                    <FileText size={20} className="text-violet-300" />
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ring-1 ${getCategoryColor(doc.category)}`}>
                    {doc.category}
                  </span>
                </div>
                <h3 className="mb-1 truncate text-sm font-semibold text-white">{doc.title}</h3>
                {doc.description && (
                  <p className="mb-3 line-clamp-2 text-xs text-slate-400">{doc.description}</p>
                )}
                <p className="mb-3 text-[10px] text-slate-500">
                  {new Date(doc.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <div className="flex gap-2">
                  <a
                    href={getFileUrl(doc.file)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-2 text-xs font-medium text-slate-300 transition hover:border-violet-400/40 hover:text-white"
                  >
                    <Download size={14} />
                    View
                  </a>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="flex items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-red-400 transition hover:border-red-500/40 hover:bg-red-500/20"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowUpload(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Upload Document</h2>
                <button onClick={() => setShowUpload(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              {error && (
                <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-300 ring-1 ring-red-500/30">{error}</p>
              )}

              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g., My Resume 2026"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-violet-400/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-violet-400/50 focus:outline-none"
                  >
                    {categories.slice(1).map((cat) => (
                      <option key={cat} value={cat} className="bg-slate-800">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={2}
                    placeholder="Optional notes..."
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-violet-400/50 focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">File *</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-violet-500/20 file:px-3 file:py-1 file:text-sm file:font-medium file:text-violet-300 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:shadow-violet-500/40 disabled:opacity-60"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PersonalDocsPage;
