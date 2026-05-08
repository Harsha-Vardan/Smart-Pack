import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { login, signup } from '../services/api';
import ParticleCanvas from '../components/ParticleCanvas';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { loginUser } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = isLogin
        ? await login(username, password)
        : await signup(username, password);

      loginUser(res.data.user, res.data.token);
      toast.success(res.data.message);
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      <ParticleCanvas />

      {/* Brand */}
      <div className="text-center mb-8 relative z-10">
        <div className="text-6xl mb-3 animate-float">🎒</div>
        <h1 className="text-4xl font-black gradient-text">Pack Smart</h1>
        <p className="text-slate-400 mt-1 text-base">
          Optimize your luggage with the power of algorithms
        </p>
      </div>

      {/* Auth Card */}
      <div className="glass rounded-2xl p-7 w-full max-w-md relative z-10 animate-slide-up">
        {/* Tabs */}
        <div className="flex bg-white/5 rounded-xl p-1 mb-6 relative">
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 z-10 relative
              ${isLogin ? 'text-white' : 'text-slate-400 hover:text-slate-300'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 z-10 relative
              ${!isLogin ? 'text-white' : 'text-slate-400 hover:text-slate-300'}`}
          >
            Sign Up
          </button>
          {/* Sliding indicator */}
          <div
            className="absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] bg-indigo-500 rounded-lg transition-all duration-300"
            style={{ left: isLogin ? '4px' : 'calc(50% + 0px)' }}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/25 transition-all">
            <span className="px-3.5 text-lg">👤</span>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              className="flex-1 bg-transparent py-3 pr-4 text-sm text-white placeholder-slate-500 outline-none"
            />
          </div>

          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/25 transition-all">
            <span className="px-3.5 text-lg">🔒</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="flex-1 bg-transparent py-3 pr-4 text-sm text-white placeholder-slate-500 outline-none"
            />
          </div>

          {!isLogin && (
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/25 transition-all animate-slide-up">
              <span className="px-3.5 text-lg">🔒</span>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="flex-1 bg-transparent py-3 pr-4 text-sm text-white placeholder-slate-500 outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-btn text-white font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center animate-slide-up">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
