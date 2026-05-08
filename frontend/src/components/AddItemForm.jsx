import { useState } from 'react';

export default function AddItemForm({ onAdd }) {
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [importance, setImportance] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onAdd(name.trim(), parseFloat(weight), parseInt(importance));
    setName('');
    setWeight('');
    setImportance('');
    setLoading(false);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 animate-slide-up h-full flex flex-col relative overflow-hidden" style={{ animationDelay: '0.1s' }}>
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-500/20 blur-[50px] rounded-full pointer-events-none" />
      
      <h2 className="text-xl font-bold mb-6 flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">➕</div>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Add Item</span>
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col relative z-10">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Item Name</label>
          <div className="glass-input rounded-2xl flex items-center px-4 overflow-hidden">
            <span className="text-lg opacity-50 mr-3">📦</span>
            <input
              type="text"
              placeholder="e.g., Laptop, Jacket"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="flex-1 bg-transparent py-4 text-sm font-medium text-white placeholder-slate-600 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Weight</label>
            <div className="glass-input rounded-2xl flex items-center px-4 overflow-hidden">
              <span className="text-lg opacity-50 mr-2">⚖️</span>
              <input
                type="number"
                placeholder="kg"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                min="0.1"
                step="0.1"
                className="flex-1 bg-transparent py-4 text-sm font-medium text-white placeholder-slate-600 outline-none"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Score (1-10)</label>
            <div className="glass-input rounded-2xl flex items-center px-4 overflow-hidden">
              <span className="text-lg opacity-50 mr-2">⭐</span>
              <input
                type="number"
                placeholder="10"
                value={importance}
                onChange={(e) => setImportance(e.target.value)}
                required
                min="1"
                max="10"
                step="1"
                className="flex-1 bg-transparent py-4 text-sm font-medium text-white placeholder-slate-600 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-btn text-white font-bold py-4 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer uppercase tracking-widest text-xs"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Add to Pack List'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
