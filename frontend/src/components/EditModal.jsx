import { useState } from 'react';

export default function EditModal({ item, onSave, onClose }) {
  const [name, setName] = useState(item.name);
  const [weight, setWeight] = useState(item.weight);
  const [importance, setImportance] = useState(item.importance);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(item._id, { name, weight: parseFloat(weight), importance: parseInt(importance) });
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="glass rounded-2xl p-7 w-full max-w-md animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold">✏️ Edit Item</h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white text-2xl leading-none transition-colors cursor-pointer"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/25 transition-all">
            <span className="px-3.5 text-base">📦</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="flex-1 bg-transparent py-3 pr-4 text-sm text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/25 transition-all">
              <span className="px-3 text-base">⚖️</span>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                min="0.1"
                step="0.1"
                className="flex-1 bg-transparent py-3 pr-3 text-sm text-white outline-none"
              />
            </div>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/25 transition-all">
              <span className="px-3 text-base">⭐</span>
              <input
                type="number"
                value={importance}
                onChange={(e) => setImportance(e.target.value)}
                required
                min="1"
                max="10"
                className="flex-1 bg-transparent py-3 pr-3 text-sm text-white outline-none"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-400 border border-white/10 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-semibold gradient-btn text-white rounded-xl transition-all disabled:opacity-50 cursor-pointer border-0"
            >
              {loading ? '...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
