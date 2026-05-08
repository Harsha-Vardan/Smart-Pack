import { useAuth } from '../context/AuthContext';

export default function Navbar({ username }) {
  const { logoutUser } = useAuth();

  return (
    <nav className="glass-panel rounded-full mx-4 sm:mx-auto max-w-5xl mt-6 mb-8 px-6 py-3 flex items-center justify-between sticky top-6 z-50 animate-slide-up border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          🎒
        </div>
        <span className="text-xl font-black tracking-tight text-white hidden sm:block">
          Pack<span className="text-indigo-400">Smart</span>
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end hidden sm:flex">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Logged in as</span>
          <span className="text-sm font-bold text-slate-200">{username}</span>
        </div>
        <div className="w-px h-8 bg-white/10 hidden sm:block mx-1"></div>
        <button
          onClick={logoutUser}
          className="px-5 py-2 text-sm font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
