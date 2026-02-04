import { useEffect, useState } from 'react';
import api from '../utils/api.js';
import NoteCard from '../components/NoteCard.jsx';
import Loader from '../components/Loader.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const baseCategories = ['Mathematics', 'Science', 'History', 'Technology', 'Language', 'Business'];

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [sort, setSort] = useState('newest');
  const [categoryMeta, setCategoryMeta] = useState([]);

  const fetchNotes = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, sort };
      if (search) params.search = search;
      if (category) params.category = category;
      const { data } = await api.get('/notes', { params });
      setNotes(data.data || []);
      setPages(data.pages || 1);
      setCategoryMeta(data.categories || []);
    } catch (err) {
      setError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort]);

  const handleFilter = (e) => {
    e.preventDefault();
    setPage(1);
    fetchNotes();
  };

  const categoryOptions = Array.from(new Set([...baseCategories, ...notes.map((n) => n.category)]));

  const grouped = notes.reduce((acc, note) => {
    const key = note.category || 'Uncategorized';
    acc[key] = acc[key] ? [...acc[key], note] : [note];
    return acc;
  }, {});

  const sortedCategories = Object.keys(grouped).sort((a, b) => a.localeCompare(b));

  return (
    <section className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 shadow-lg ring-1 ring-white/5"
      >
        <form className="flex w-full flex-wrap items-center gap-3" onSubmit={handleFilter}>
          <input
            type="text"
            placeholder="Search by title"
            className="min-w-[200px] flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-slate-100 placeholder:text-slate-400 focus:border-sky-400/70 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-slate-100 focus:border-sky-400/70 focus:outline-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-slate-100 focus:border-sky-400/70 focus:outline-none"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="likes">Most liked</option>
          </select>
          <button
            type="submit"
            className="rounded-lg bg-sky-500 px-4 py-2 text-white shadow hover:bg-sky-400"
          >
            Apply
          </button>
        </form>
      </motion.div>

      {categoryMeta.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categoryMeta.map((c) => (
            <button
              key={c.category}
              className={`rounded-full px-3 py-1 text-sm border ${
                category === c.category
                  ? 'border-sky-400/70 bg-sky-500/10 text-sky-100'
                  : 'border-white/10 text-slate-200 hover:border-sky-300/40'
              }`}
              onClick={() => {
                setCategory(c.category);
                setPage(1);
              }}
            >
              {c.category} ({c.count})
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <Loader />
      ) : error ? (
        <p className="rounded bg-red-500/10 p-3 text-red-200 ring-1 ring-red-500/20">{error}</p>
      ) : notes.length === 0 ? (
        <p className="text-slate-300">No notes found.</p>
      ) : (
        <div className="space-y-6">
          {sortedCategories.map((cat, idx) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{cat}</h3>
                <span className="text-sm text-slate-300">{grouped[cat].length} notes</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {grouped[cat].map((note) => (
                    <NoteCard key={note._id} note={note} />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-3 text-slate-200">
              <button
                className="rounded-lg border border-white/10 px-3 py-1 hover:border-sky-300/50 disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </button>
              <span className="text-sm">
                Page {page} of {pages}
              </span>
              <button
                className="rounded-lg border border-white/10 px-3 py-1 hover:border-sky-300/50 disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default NotesPage;
