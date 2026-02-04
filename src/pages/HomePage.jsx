import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage = () => {
  return (
    <section className="grid gap-12 lg:grid-cols-2 lg:items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="space-y-6"
      >
        <p className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-200 ring-1 ring-sky-400/30">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(52,211,153,0.15)]" />
          Share knowledge. Study smarter.
        </p>
        <h1 className="text-4xl font-bold text-white sm:text-5xl">
          Upload and discover notes in seconds.
        </h1>
        <p className="text-lg text-slate-200/80">
          A collaborative platform to upload, search, like, and comment on study notes. Built for students and
          educators who want a fast, clean experience.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/notes" className="rounded-lg bg-sky-500 px-5 py-2.5 text-white shadow-lg shadow-sky-500/30 hover:bg-sky-400">
            Browse Notes
          </Link>
          <Link
            to="/register"
            className="rounded-lg border border-white/10 px-5 py-2.5 text-slate-100 hover:border-sky-400/60 hover:text-white"
          >
            Get Started
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative hidden lg:block"
      >
        <div className="absolute -left-10 -top-10 h-44 w-44 rounded-full bg-sky-500/30 blur-3xl" />
        <div className="absolute -right-8 bottom-4 h-32 w-32 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="relative overflow-hidden rounded-2xl bg-white/5 p-6 shadow-2xl ring-1 ring-white/10">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-sm font-semibold text-white">Recent uploads</span>
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-200 ring-1 ring-emerald-400/30">Live</span>
          </div>
          <div className="space-y-3 text-sm text-slate-100">
            <div className="flex justify-between rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/5">
              <span>Calculus Notes.pdf</span>
              <span className="text-slate-300">12 likes</span>
            </div>
            <div className="flex justify-between rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/5">
              <span>History Summary.docx</span>
              <span className="text-slate-300">8 likes</span>
            </div>
            <div className="flex justify-between rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/5">
              <span>Biology Guide.txt</span>
              <span className="text-slate-300">5 likes</span>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-indigo-500/10" />
        </div>
      </motion.div>
    </section>
  );
};

export default HomePage;
