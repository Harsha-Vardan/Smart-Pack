export default function ItemsList({ items, loading, onDelete, onEdit }) {
  if (loading) {
    return (
      <div className="glass rounded-2xl p-5 animate-slide-up flex items-center justify-center min-h-[200px]" style={{ animationDelay: '0.2s' }}>
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold flex items-center gap-2">📋 Your Items</h2>
        <span className="text-xs text-slate-500 bg-white/5 px-2.5 py-1 rounded-full">
          {items.length} item{items.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="max-h-[400px] overflow-y-auto pr-1 space-y-2">
        {items.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-sm">No items yet. Start adding items to your pack list!</p>
          </div>
        ) : (
          items.map((item, i) => (
            <div
              key={item._id}
              className="flex items-center justify-between bg-white/5 hover:bg-white/8 rounded-xl px-4 py-3 transition-all animate-slide-up group"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm truncate">{item.name}</div>
                <div className="flex gap-3 text-xs text-slate-500 mt-0.5">
                  <span>⚖️ {item.weight} kg</span>
                  <span>⭐ {item.importance}/10</span>
                </div>
              </div>
              <div className="flex gap-1.5 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(item)}
                  className="px-2.5 py-1 text-xs font-medium text-indigo-400 border border-indigo-500/30 rounded-lg hover:bg-indigo-500/10 transition-all cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item._id)}
                  className="px-2.5 py-1 text-xs font-medium text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-all cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
