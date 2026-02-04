import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Heart, Star, Link2, MessageCircle, Send } from 'lucide-react';
import api from '../utils/api.js';
import { buildFileUrl } from '../utils/fileUrl.js';
import Loader from '../components/Loader.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const NoteDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [likeState, setLikeState] = useState({ likes: 0, liked: false });
  const [favoriteState, setFavoriteState] = useState({ favorited: false });
  const [previewText, setPreviewText] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchNote = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/notes/${id}`);
      setNote(data);
      setLikeState({ likes: data.likes?.length || 0, liked: data.likes?.includes(user?.id) });
      setFavoriteState({ favorited: user?.favorites?.includes(data._id) });
      if (data.fileUrl?.endsWith('.txt')) {
        try {
          const res = await fetch(buildFileUrl(data.fileUrl));
          const text = await res.text();
          setPreviewText(text.slice(0, 2000));
        } catch (e) {
          // ignore preview errors
        }
      }
    } catch (err) {
      setError('Failed to load note');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleLike = async () => {
    if (!user) {
      setError('Login to like notes');
      return;
    }
    try {
      const { data } = await api.post(`/notes/like/${id}`);
      setLikeState(data);
    } catch (err) {
      setError('Unable to like note');
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      setError('Login to favorite notes');
      return;
    }
    try {
      const { data } = await api.post(`/notes/favorite/${id}`);
      setFavoriteState(data);
    } catch (err) {
      setError('Unable to favorite');
    }
  };

  const shareLink = `${window.location.origin}/notes/${id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Login to comment');
      return;
    }
    try {
      const { data } = await api.post(`/notes/comment/${id}`, { text: comment });
      setNote((prev) => ({ ...prev, comments: data }));
      setComment('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to comment');
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="rounded-lg bg-red-500/10 p-4 text-red-300 ring-1 ring-red-500/30">{error}</p>;
  if (!note) return null;

  return (
    <section className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
      >
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{note.title}</h1>
            <p className="mt-1 text-sm text-slate-400">By {note.uploadedBy?.name}</p>
          </div>
          <span className="inline-flex w-fit rounded-full bg-sky-500/15 px-4 py-1.5 text-sm font-medium text-sky-300 ring-1 ring-sky-500/30">
            {note.category}
          </span>
        </div>

        <p className="mt-4 text-slate-300">{note.description}</p>

        {/* Action buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={buildFileUrl(note.fileUrl)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-lg shadow-sky-500/25 transition hover:shadow-sky-500/40"
            target="_blank"
            rel="noreferrer"
          >
            <Download size={16} />
            Download
          </a>
          <button
            onClick={handleLike}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
              likeState.liked
                ? 'border-rose-500/30 bg-rose-500/15 text-rose-300'
                : 'border-white/10 bg-white/5 text-slate-300 hover:border-rose-500/30 hover:text-rose-300'
            }`}
          >
            <Heart size={16} className={likeState.liked ? 'fill-current' : ''} />
            {likeState.likes}
          </button>
          <button
            onClick={handleFavorite}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
              favoriteState.favorited
                ? 'border-amber-500/30 bg-amber-500/15 text-amber-300'
                : 'border-white/10 bg-white/5 text-slate-300 hover:border-amber-500/30 hover:text-amber-300'
            }`}
          >
            <Star size={16} className={favoriteState.favorited ? 'fill-current' : ''} />
            {favoriteState.favorited ? 'Saved' : 'Save'}
          </button>
        </div>

        {/* Share link */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-slate-500">
            <Link2 size={14} />
          </div>
          <input
            readOnly
            value={shareLink}
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 focus:outline-none"
            onFocus={(e) => e.target.select()}
          />
          <button
            onClick={handleCopy}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-sky-400/40 hover:text-sky-300"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* PDF Preview */}
        {note.fileUrl?.endsWith('.pdf') && (
          <div className="mt-6 h-[500px] overflow-hidden rounded-xl border border-white/10">
            <iframe title="Preview" src={buildFileUrl(note.fileUrl)} className="h-full w-full bg-white" />
          </div>
        )}

        {/* Text Preview */}
        {previewText && (
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="mb-2 text-sm font-semibold text-slate-300">Preview</p>
            <pre className="whitespace-pre-wrap text-sm text-slate-400">{previewText}</pre>
          </div>
        )}
      </motion.div>

      {/* Comments Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
      >
        <div className="mb-4 flex items-center gap-2">
          <MessageCircle size={20} className="text-slate-400" />
          <h3 className="text-lg font-semibold text-white">Comments</h3>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-400">
            {note.comments?.length || 0}
          </span>
        </div>

        <form className="mb-5 flex gap-2" onSubmit={handleComment}>
          <input
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 hover:bg-sky-400"
          >
            <Send size={14} />
            Post
          </motion.button>
        </form>

        <div className="space-y-3">
          {note.comments?.length === 0 && (
            <p className="text-sm text-slate-500">No comments yet. Be the first to comment!</p>
          )}
          {note.comments?.map((c) => (
            <div key={c._id} className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
              <p className="text-sm text-slate-200">{c.text}</p>
              <p className="mt-1 text-xs text-slate-500">{c.user?.name || 'User'}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default NoteDetailPage;
