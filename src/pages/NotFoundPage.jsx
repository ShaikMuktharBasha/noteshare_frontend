import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <div className="rounded-2xl border border-white/10 bg-white/5 px-10 py-12 shadow-2xl shadow-cyan-500/10 backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200/80">404</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Page not found</h1>
        <p className="mt-3 max-w-xl text-slate-300/80">
          The page you are looking for doesn&apos;t exist or might have moved. Let&apos;s get you back to a safe place.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/login"
            className="rounded-lg bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-400/30 transition hover:bg-cyan-300"
          >
            Go to login
          </Link>
          <Link
            to="/notes"
            className="rounded-lg border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-100"
          >
            View notes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
