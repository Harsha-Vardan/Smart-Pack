import { useState } from 'react';

export default function CapacityBar({ bagCapacity, usedWeight, onUpdate }) {
  const [capacity, setCapacity] = useState(bagCapacity);
  const [updating, setUpdating] = useState(false);

  const pct = bagCapacity > 0 ? Math.min((usedWeight / bagCapacity) * 100, 100) : 0;
  const rounded = Math.round(usedWeight * 10) / 10;

  const handleUpdate = async () => {
    if (capacity <= 0) return;
    setUpdating(true);
    await onUpdate(capacity);
    setUpdating(false);
  };

  return (
    <div className="glass rounded-2xl p-5 mb-5 animate-slide-up relative z-10">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <h2 className="text-base font-bold flex items-center gap-2">🧳 Bag Capacity</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 py-1">
            <input
              type="number"
              min="1"
              max="100"
              step="0.5"
              value={capacity}
              onChange={(e) => setCapacity(parseFloat(e.target.value) || 0)}
              className="w-14 bg-transparent text-center text-sm text-white outline-none"
            />
            <span className="text-slate-500 text-xs ml-1">kg</span>
          </div>
          <button
            onClick={handleUpdate}
            disabled={updating}
            className="px-3.5 py-1.5 text-sm font-semibold bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            {updating ? '...' : 'Update'}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: pct > 90
              ? 'linear-gradient(90deg, #ef4444, #f59e0b)'
              : 'linear-gradient(90deg, #22c55e, #06b6d4)',
          }}
        />
      </div>
      <div className="flex justify-between mt-1.5 text-xs text-slate-500">
        <span>{rounded} kg used</span>
        <span>of {bagCapacity} kg</span>
      </div>
    </div>
  );
}
