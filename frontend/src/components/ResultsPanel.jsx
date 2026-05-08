export default function ResultsPanel({ results }) {
  const {
    selectedItems,
    excludedItems,
    totalWeight,
    totalImportance,
    remainingCapacity,
    dpTableSize,
    totalCombinations,
    processingTime,
  } = results;

  const stats = [
    { emoji: '✅', value: selectedItems.length, label: 'Items to Pack', color: 'from-emerald-500 to-cyan-500' },
    { emoji: '⚖️', value: `${totalWeight} kg`, label: 'Total Weight', color: 'from-sky-500 to-indigo-500' },
    { emoji: '⭐', value: totalImportance, label: 'Total Importance', color: 'from-indigo-500 to-purple-500' },
    { emoji: '🎯', value: `${remainingCapacity} kg`, label: 'Space Left', color: 'from-amber-500 to-red-500' },
  ];

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div
            key={i}
            className="glass rounded-2xl p-5 text-center relative overflow-hidden animate-slide-up"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${s.color}`} />
            <div className="text-2xl mb-1">{s.emoji}</div>
            <div className="text-2xl font-extrabold">{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Algorithm Info */}
      <div className="glass rounded-2xl p-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">🧠 Algorithm Performance</h3>
        <div className="flex flex-wrap gap-6">
          <div>
            <div className="text-xs text-slate-500">DP Table Size</div>
            <div className="text-sm font-bold text-indigo-400">
              {dpTableSize.rows} × {dpTableSize.cols}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Possible Combinations</div>
            <div className="text-sm font-bold text-indigo-400">
              {totalCombinations.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Processing Time</div>
            <div className="text-sm font-bold text-indigo-400">{processingTime}</div>
          </div>
        </div>
      </div>

      {/* Selected Items */}
      <div className="glass rounded-2xl p-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <h3 className="text-sm font-bold mb-3 text-emerald-400 flex items-center gap-2">
          ✅ Pack These Items ({selectedItems.length})
        </h3>
        <div className="space-y-2">
          {selectedItems.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">No items selected.</p>
          ) : (
            selectedItems.map((item, i) => (
              <div
                key={item._id}
                className="flex items-center justify-between bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-4 py-3 animate-slide-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span className="font-semibold text-sm">{item.name}</span>
                <div className="flex gap-4 text-xs text-slate-400">
                  <span>⚖️ {item.weight} kg</span>
                  <span>⭐ {item.importance}/10</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Excluded Items */}
      {excludedItems.length > 0 && (
        <div className="glass rounded-2xl p-5 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-sm font-bold mb-3 text-red-400 flex items-center gap-2">
            ❌ Leave Behind ({excludedItems.length})
          </h3>
          <div className="space-y-2">
            {excludedItems.map((item, i) => (
              <div
                key={item._id}
                className="flex items-center justify-between bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-3 opacity-60 animate-slide-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span className="font-semibold text-sm">{item.name}</span>
                <div className="flex gap-4 text-xs text-slate-400">
                  <span>⚖️ {item.weight} kg</span>
                  <span>⭐ {item.importance}/10</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
