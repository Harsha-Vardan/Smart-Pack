import { useState } from 'react';

export default function CapacityBar({ bagCapacity, usedWeight, onUpdate }) {
  const [capacity, setCapacity] = useState(bagCapacity);
  const [updating, setUpdating] = useState(false);

  const pct = bagCapacity > 0 ? Math.min((usedWeight / bagCapacity) * 100, 100) : 0;
  const rounded = Math.round(usedWeight * 10) / 10;
  const isOver = pct > 90;

  const handleUpdate = async () => {
    if (capacity <= 0) return;
    setUpdating(true);
    await onUpdate(capacity);
    setUpdating(false);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 mb-6 animate-slide-up relative overflow-hidden">
      {/* Background glow based on capacity */}
      <div 
        className="absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full opacity-20 pointer-events-none transition-colors duration-1000"
        style={{ background: isOver ? '#ef4444' : '#10b981' }}
      />

      <div className="flex items-center justify-between flex-wrap gap-4 mb-6 relative z-10">
        <h2 className="text-xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">🧳</div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Bag Capacity</span>
        </h2>
        
        <div className="flex items-center gap-3 bg-black/40 p-1.5 rounded-2xl border border-white/5">
          <div className="flex items-center px-4">
            <input
              type="number"
              min="1"
              max="100"
              step="0.5"
              value={capacity}
              onChange={(e) => setCapacity(parseFloat(e.target.value) || 0)}
              className="w-16 bg-transparent text-center text-lg font-bold text-white outline-none"
            />
            <span className="text-slate-500 font-medium ml-1">kg</span>
          </div>
          <button
            onClick={handleUpdate}
            disabled={updating}
            className="px-5 py-2 text-sm font-bold bg-white text-black rounded-xl hover:bg-slate-200 transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            {updating ? '...' : 'Set Limit'}
          </button>
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex justify-between mb-2 text-sm font-bold">
          <span className={isOver ? 'text-red-400' : 'text-emerald-400'}>{rounded} kg used</span>
          <span className="text-slate-500">{bagCapacity} kg total</span>
        </div>
        <div className="h-4 bg-black/50 rounded-full overflow-hidden border border-white/5 p-0.5">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
            style={{
              width: `${pct}%`,
              background: isOver
                ? 'linear-gradient(90deg, #f43f5e, #f59e0b)'
                : 'linear-gradient(90deg, #10b981, #0ea5e9)',
              boxShadow: isOver ? '0 0 10px rgba(244,63,94,0.5)' : '0 0 10px rgba(16,185,129,0.5)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-[200%] animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}
