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
    <div className="glass rounded-2xl p-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <h2 className="text-base font-bold mb-4 flex items-center gap-2">➕ Add Item</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center bg-white/5 border border-white/10 rounded-xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/25 transition-all">
          <span className="px-3.5 text-base">📦</span>
          <input
            type="text"
            placeholder="Item name (e.g., Laptop)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="flex-1 bg-transparent py-3 pr-4 text-sm text-white placeholder-slate-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/25 transition-all">
            <span className="px-3 text-base">⚖️</span>
            <input
              type="number"
              placeholder="Weight (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              min="0.1"
              step="0.1"
              className="flex-1 bg-transparent py-3 pr-3 text-sm text-white placeholder-slate-500 outline-none"
            />
          </div>
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/25 transition-all">
            <span className="px-3 text-base">⭐</span>
            <input
              type="number"
              placeholder="Importance (1-10)"
              value={importance}
              onChange={(e) => setImportance(e.target.value)}
              required
              min="1"
              max="10"
              step="1"
              className="flex-1 bg-transparent py-3 pr-3 text-sm text-white placeholder-slate-500 outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full gradient-btn text-white font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer border-0"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Add to Pack List'
          )}
        </button>
      </form>
    </div>
  );
}
