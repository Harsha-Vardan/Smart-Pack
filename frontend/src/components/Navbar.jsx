import { useAuth } from '../context/AuthContext';

export default function Navbar({ username }) {
  const { logoutUser } = useAuth();

  return (
    <nav className="glass rounded-2xl mx-4 sm:mx-6 mt-4 mb-5 px-5 py-3 flex items-center justify-between sticky top-4 z-50 relative">
      <div className="flex items-center gap-2.5">
        <span className="text-2xl">🎒</span>
        <span className="text-lg font-extrabold gradient-text">Pack Smart</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-slate-400 text-sm hidden sm:inline">
          Hey, <span className="text-slate-200 font-medium">{username}</span>
        </span>
        <button
          onClick={logoutUser}
          className="px-3.5 py-1.5 text-sm font-semibold text-slate-400 border border-white/10 rounded-lg hover:bg-white/5 hover:text-white transition-all cursor-pointer"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
