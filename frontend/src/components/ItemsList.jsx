export default function ItemsList({ items, loading, onDelete, onEdit }) {
  if (loading) {
    return (
      <div className="glass-panel rounded-3xl p-6 sm:p-8 animate-slide-up flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/10 blur-[40px] rounded-full" />
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin relative z-10" />
        <div className="mt-4 text-slate-500 text-sm font-medium relative z-10 tracking-widest uppercase">Loading Inventory...</div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 animate-slide-up flex flex-col h-full relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/20 blur-[50px] rounded-full pointer-events-none" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <h2 className="text-xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">📋</div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Your Items</span>
        </h2>
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
          </span>
          <span className="text-xs font-bold text-indigo-400 tracking-widest uppercase">
            {items.length} {items.length !== 1 ? 'Items' : 'Item'}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 relative z-10 custom-scrollbar">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-slate-500 opacity-80">
            <div className="text-5xl mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">📭</div>
            <p className="text-sm font-medium">Your pack list is empty.</p>
            <p className="text-xs mt-1 text-slate-600">Start adding items on the left.</p>
          </div>
        ) : (
          items.map((item, i) => (
            <div
              key={item._id}
              className="group flex items-center justify-between bg-black/40 hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-4 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="min-w-0 flex-1">
                <div className="font-bold text-sm text-slate-200 truncate group-hover:text-white transition-colors">{item.name}</div>
                <div className="flex gap-4 text-xs font-medium text-slate-500 mt-1.5">
                  <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-md">⚖️ {item.weight} kg</span>
                  <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-md">⭐ {item.importance}/10</span>
                </div>
              </div>
              <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                <button
                  onClick={() => onEdit(item)}
                  className="w-8 h-8 flex items-center justify-center text-sm bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl hover:bg-indigo-500 hover:text-white transition-all cursor-pointer shadow-[0_0_10px_rgba(99,102,241,0)] hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                  title="Edit Item"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(item._id)}
                  className="w-8 h-8 flex items-center justify-center text-sm bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl hover:bg-rose-500 hover:text-white transition-all cursor-pointer shadow-[0_0_10px_rgba(244,63,94,0)] hover:shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                  title="Delete Item"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
