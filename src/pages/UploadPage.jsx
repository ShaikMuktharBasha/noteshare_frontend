import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileUp } from 'lucide-react';
import api from '../utils/api.js';
import { useNavigate } from 'react-router-dom';

const UploadPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!file) {
      setError('Please select a file');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('category', form.category);
    formData.append('file', file);

    try {
      await api.post('/notes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 shadow-lg shadow-sky-500/25">
          <Upload size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Upload Note</h1>
          <p className="text-sm text-slate-400">Share study materials with others</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
      >
        {error && (
          <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-300 ring-1 ring-red-500/30">{error}</p>
        )}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Title</label>
            <input
              type="text"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none"
              placeholder="e.g., Data Structures Notes"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Description</label>
            <textarea
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none resize-none"
              rows="4"
              placeholder="Brief description of the content..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Category</label>
            <input
              type="text"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none"
              placeholder="e.g., Computer Science, Mathematics"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">File (PDF, DOCX, TXT)</label>
            <div className="relative">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-sky-500/20 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-sky-300 focus:outline-none"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </div>
            {file && (
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                <FileUp size={14} />
                {file.name}
              </p>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-sky-500/25 transition hover:shadow-sky-500/40 disabled:opacity-60"
          >
            {loading ? 'Uploading...' : 'Upload Note'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default UploadPage;
