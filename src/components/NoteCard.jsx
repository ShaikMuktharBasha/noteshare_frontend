import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { buildFileUrl } from '../utils/fileUrl.js';

const NoteCard = ({ note }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 shadow-lg ring-1 ring-white/5"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold text-slate-100">{note.title}</h3>
        <span className="rounded-full bg-sky-500/15 px-2 py-1 text-xs font-medium text-sky-200 ring-1 ring-sky-400/40">
          {note.category}
        </span>
      </div>
      <p className="text-sm text-slate-200/80 line-clamp-2">{note.description}</p>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>By {note.uploadedBy?.name || 'Unknown'}</span>
        <span>{note.likes?.length || 0} likes</span>
      </div>
      <div className="flex items-center gap-2">
        <a
          href={buildFileUrl(note.fileUrl)}
          target="_blank"
          rel="noreferrer"
          className="w-full rounded-lg border border-white/10 px-3 py-2 text-center text-sm text-slate-100 hover:border-sky-400/60 hover:text-white"
        >
          Download
        </a>
        <Link
          to={`/notes/${note._id}`}
          className="w-full rounded-lg bg-sky-600 px-3 py-2 text-center text-sm text-white shadow hover:bg-sky-500"
        >
          View
        </Link>
      </div>
    </motion.article>
  );
};

export default NoteCard;
