import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Loader from '../components/Loader.jsx';

const AdminPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [{ data: statData }, { data: noteData }] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/notes'),
        ]);
        setStats(statData);
        setNotes(noteData);
      } catch (err) {
        setError('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this note?')) return;
    try {
      await api.delete(`/admin/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      setError('Delete failed');
    }
  };

  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  if (loading) return <Loader />;

  return (
    <section className="space-y-6">
      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="text-xl font-semibold">Admin Dashboard</h2>
        {error && <p className="mt-2 rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}
        {stats && (
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-700">
            <span className="rounded bg-slate-100 px-3 py-2">Users: {stats.users}</span>
            <span className="rounded bg-slate-100 px-3 py-2">Notes: {stats.notes}</span>
            <span className="rounded bg-slate-100 px-3 py-2">Likes: {stats.likes}</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">All Notes</h3>
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note._id} className="rounded-lg bg-white p-4 shadow">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h4 className="text-base font-semibold text-slate-900">{note.title}</h4>
                  <p className="text-sm text-slate-600">{note.description}</p>
                  <p className="text-xs text-slate-500">By {note.uploadedBy?.name || 'Unknown'}</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="rounded bg-sky-50 px-2 py-1 text-sky-700">{note.likes?.length || 0} likes</span>
                  <button
                    className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-400"
                    onClick={() => handleDelete(note._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {notes.length === 0 && <p className="text-sm text-slate-600">No notes found.</p>}
        </div>
      </div>
    </section>
  );
};

export default AdminPage;
