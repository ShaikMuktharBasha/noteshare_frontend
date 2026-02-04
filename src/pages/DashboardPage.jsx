import { useEffect, useState } from 'react';
import api from '../utils/api.js';
import Loader from '../components/Loader.jsx';
import { buildFileUrl } from '../utils/fileUrl.js';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardPage = () => {
  const [notes, setNotes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);

  const fetchNotes = async () => {
    setLoading(true);
    setError('');
    try {
      const [{ data: mine }, { data: fav }] = await Promise.all([
        api.get('/notes', { params: { mine: true, limit: 50 } }),
        api.get('/notes', { params: { favorites: true, limit: 50 } }),
      ]);
      setNotes(mine.data || mine);
      setFavorites(fav.data || fav);
    } catch (err) {
      setError('Failed to load your notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this note?')) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      setError('Delete failed');
    }
  };

  const startEdit = (note) => {
    setEditing({ id: note._id, title: note.title, description: note.description, category: note.category });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editing) return;
    try {
      const { data } = await api.put(`/notes/${editing.id}`, {
        title: editing.title,
        description: editing.description,
        category: editing.category,
      });
      setNotes((prev) => prev.map((n) => (n._id === editing.id ? data : n)));
      setEditing(null);
    } catch (err) {
      setError('Update failed');
    }
  };

  const totalLikes = notes.reduce((sum, n) => sum + (n.likes?.length || 0), 0);

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-lg ring-1 ring-white/5">
        <h2 className="text-xl font-semibold text-white">Dashboard</h2>
        <p className="text-slate-300">Uploaded notes: {notes.length} · Total likes: {totalLikes}</p>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>
      ) : notes.length === 0 ? (
        <p className="text-slate-600">You have not uploaded any notes yet.</p>
      ) : (
        <div className="space-y-4">
          {notes.map((note, idx) => (
            <motion.div
              key={note._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-lg ring-1 ring-white/5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{note.title}</h3>
                  <p className="text-sm text-slate-200/90">{note.description}</p>
                  <p className="text-xs text-slate-400">Category: {note.category}</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="rounded bg-sky-500/15 px-2 py-1 text-sky-100 ring-1 ring-sky-400/30">
                    {note.likes?.length || 0} likes
                  </span>
                  <a
                    href={buildFileUrl(note.fileUrl)}
                    className="rounded border border-white/10 px-3 py-1 text-slate-100 hover:border-sky-300/50"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download
                  </a>
                  <button
                    className="rounded bg-slate-800 px-3 py-1 text-white hover:bg-slate-700"
                    onClick={() => startEdit(note)}
                  >
                    Edit
                  </button>
                  <button
                    className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-400"
                    onClick={() => handleDelete(note._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Favorites</h3>
        {loading ? (
          <Loader />
        ) : favorites.length === 0 ? (
          <p className="text-slate-600">No favorites yet.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {favorites.map((fav) => (
              <div key={fav._id} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{fav.title}</p>
                    <p className="text-sm text-slate-600">{fav.category}</p>
                  </div>
                  <a href={`/notes/${fav._id}`} className="text-sky-600 text-sm">
                    View
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10 flex items-center justify-center bg-black/60"
          >
            <motion.form
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl ring-1 ring-white/10"
              onSubmit={handleUpdate}
            >
              <h3 className="mb-4 text-lg font-semibold text-white">Edit note</h3>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-200">Title</label>
                  <input
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-sky-400/70 focus:outline-none"
                    value={editing.title}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-200">Description</label>
                  <textarea
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-sky-400/70 focus:outline-none"
                    rows="3"
                    value={editing.description}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-200">Category</label>
                  <input
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-sky-400/70 focus:outline-none"
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-white/10 px-3 py-2 text-slate-100 hover:border-sky-300/50"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-sky-500 px-3 py-2 text-white hover:bg-sky-400">
                  Save
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default DashboardPage;
