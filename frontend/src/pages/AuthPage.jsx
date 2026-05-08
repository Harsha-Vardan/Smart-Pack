import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { login, signup } from '../services/api';
import ParticleCanvas from '../components/ParticleCanvas';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
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
        : await signup(username, email, password);

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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050505]">
      {/* Dynamic Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/20 blur-[120px] mix-blend-screen animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-600/20 blur-[100px] mix-blend-screen animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      <ParticleCanvas />

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-6">
        
        {/* Left Side: Hero / Brand */}
        <div className="hidden lg:flex flex-col justify-center animate-slide-up">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-panel w-fit mb-8 border-indigo-500/30">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-sm font-medium text-indigo-200">Smart Packing Algorithm</span>
          </div>
          <h1 className="text-6xl font-black mb-6 leading-tight tracking-tight text-white">
            Optimize your <br />
            <span className="gradient-text">luggage</span> in seconds.
          </h1>
          <p className="text-xl text-slate-400 max-w-lg mb-10 leading-relaxed font-light">
            Stop guessing what to pack. Pack Smart uses Dynamic Programming to maximize your item utility while respecting weight limits.
          </p>
          
          <div className="flex gap-6">
            <div className="glass-panel p-5 rounded-2xl flex-1 border-white/5">
              <div className="text-indigo-400 text-2xl mb-2">⚡</div>
              <div className="font-bold text-white mb-1">Blazing Fast</div>
              <div className="text-sm text-slate-400">O(n × W) complexity finds the perfect combination instantly.</div>
            </div>
            <div className="glass-panel p-5 rounded-2xl flex-1 border-white/5">
              <div className="text-purple-400 text-2xl mb-2">⚖️</div>
              <div className="font-bold text-white mb-1">Precision Fit</div>
              <div className="text-sm text-slate-400">Never exceed your bag's exact weight capacity again.</div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex justify-center w-full lg:justify-end animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="glass-panel rounded-[2rem] p-8 sm:p-10 w-full max-w-md relative overflow-hidden">
            {/* Inner Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
            
            <div className="text-center mb-8 lg:hidden">
              <h2 className="text-3xl font-bold gradient-text mb-2">Pack Smart</h2>
              <p className="text-slate-400 text-sm">Optimize your luggage.</p>
            </div>

            <div className="flex bg-black/40 p-1 rounded-xl mb-8 relative border border-white/5">
              <button
                onClick={() => { setIsLogin(true); setError(''); }}
                className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all duration-300 z-10 relative
                  ${isLogin ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setIsLogin(false); setError(''); }}
                className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all duration-300 z-10 relative
                  ${!isLogin ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Sign Up
              </button>
              <div
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white/10 rounded-lg transition-transform duration-300 ease-out border border-white/10 shadow-lg"
                style={{ transform: `translateX(${isLogin ? '4px' : 'calc(100% + 4px)'})` }}
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1 uppercase tracking-wider">Username</label>
                <div className="glass-input rounded-xl flex items-center px-4 overflow-hidden">
                  <svg className="w-5 h-5 text-slate-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength={3}
                    autoComplete="off"
                    className="flex-1 bg-transparent py-3.5 text-sm text-white placeholder-slate-600 outline-none w-full"
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="animate-slide-up" style={{ animationDelay: '0.05s' }}>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1 uppercase tracking-wider">Email Address</label>
                  <div className="glass-input rounded-xl flex items-center px-4 overflow-hidden">
                    <svg className="w-5 h-5 text-slate-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1 bg-transparent py-3.5 text-sm text-white placeholder-slate-600 outline-none w-full"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1 uppercase tracking-wider">Password</label>
                <div className="glass-input rounded-xl flex items-center px-4 overflow-hidden">
                  <svg className="w-5 h-5 text-slate-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="flex-1 bg-transparent py-3.5 text-sm text-white placeholder-slate-600 outline-none w-full"
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1 uppercase tracking-wider">Confirm Password</label>
                  <div className="glass-input rounded-xl flex items-center px-4 overflow-hidden">
                    <svg className="w-5 h-5 text-slate-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    <input
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="flex-1 bg-transparent py-3.5 text-sm text-white placeholder-slate-600 outline-none w-full"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-btn text-white font-bold py-4 rounded-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 text-sm uppercase tracking-wide cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  isLogin ? 'Access Account' : 'Create Account'
                )}
              </button>
            </form>

            {error && (
              <div className="mt-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center animate-slide-up flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
