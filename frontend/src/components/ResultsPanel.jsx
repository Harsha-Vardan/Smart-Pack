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
    { emoji: '✅', value: selectedItems.length, label: 'Items to Pack', glow: 'emerald' },
    { emoji: '⚖️', value: `${totalWeight} kg`, label: 'Total Weight', glow: 'sky' },
    { emoji: '⭐', value: totalImportance, label: 'Total Score', glow: 'indigo' },
    { emoji: '🎯', value: `${remainingCapacity} kg`, label: 'Space Left', glow: 'amber' },
  ];

  return (
    <div className="space-y-6 animate-slide-up mt-8">
      <div className="flex items-center gap-4 mb-2">
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent flex-1" />
        <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight">
          OPTIMIZATION RESULTS
        </h2>
        <div className="h-px bg-gradient-to-r from-indigo-500/50 via-indigo-500/50 to-transparent flex-1" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="glass-panel rounded-3xl p-5 sm:p-6 text-center relative overflow-hidden animate-slide-up group"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className={`absolute -top-10 -right-10 w-24 h-24 blur-[40px] rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 bg-${s.glow}-500`} />
            <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{s.emoji}</div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">{s.value}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Algorithm Info & Excluded Items */}
        <div className="lg:col-span-1 space-y-6">
          {/* Algorithm Info */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 animate-slide-up relative overflow-hidden" style={{ animationDelay: '0.1s' }}>
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <h3 className="text-sm font-bold mb-5 flex items-center gap-2 text-white">
              <span className="text-xl">🧠</span> Performance
            </h3>
            <div className="space-y-4">
              <div className="bg-black/30 p-3 rounded-2xl border border-white/5 flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">DP Matrix</span>
                <span className="text-sm font-bold text-indigo-400 font-mono bg-indigo-500/10 px-2 py-1 rounded-lg border border-indigo-500/20">{dpTableSize.rows}×{dpTableSize.cols}</span>
              </div>
              <div className="bg-black/30 p-3 rounded-2xl border border-white/5 flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Paths Eval'd</span>
                <span className="text-sm font-bold text-indigo-400 font-mono bg-indigo-500/10 px-2 py-1 rounded-lg border border-indigo-500/20">{totalCombinations.toLocaleString()}</span>
              </div>
              <div className="bg-black/30 p-3 rounded-2xl border border-white/5 flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Compute Time</span>
                <span className="text-sm font-bold text-emerald-400 font-mono bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">{processingTime}</span>
              </div>
            </div>
          </div>

          {/* Excluded Items */}
          {excludedItems.length > 0 && (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 animate-slide-up relative overflow-hidden" style={{ animationDelay: '0.3s' }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-[40px] rounded-full pointer-events-none" />
              <h3 className="text-sm font-bold mb-5 text-rose-400 flex items-center gap-2">
                <span className="text-xl">❌</span> Leave Behind ({excludedItems.length})
              </h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {excludedItems.map((item, i) => (
                  <div
                    key={item._id}
                    className="flex flex-col gap-1.5 bg-rose-500/5 border border-rose-500/10 rounded-2xl px-4 py-3 opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <span className="font-bold text-sm text-slate-300">{item.name}</span>
                    <div className="flex gap-4 text-xs font-medium text-slate-500">
                      <span>⚖️ {item.weight} kg</span>
                      <span>⭐ {item.importance}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Selected Items (Bigger) */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 animate-slide-up relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none" />
          <h3 className="text-sm font-bold mb-6 text-emerald-400 flex items-center gap-2">
            <span className="text-xl">✅</span> Pack These Items ({selectedItems.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {selectedItems.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500 bg-black/20 rounded-3xl border border-white/5 border-dashed">
                <div className="text-4xl mb-3">👻</div>
                <p className="text-sm font-medium">Nothing fits the criteria.</p>
              </div>
            ) : (
              selectedItems.map((item, i) => (
                <div
                  key={item._id}
                  className="flex flex-col justify-center bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 shadow-[0_0_15px_rgba(16,185,129,0.05)] hover:bg-emerald-500/15 hover:border-emerald-500/30 transition-all duration-300 animate-slide-up group"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <span className="font-black text-base text-white mb-2 tracking-tight group-hover:text-emerald-300 transition-colors">{item.name}</span>
                  <div className="flex items-center gap-3 text-xs font-bold text-emerald-500/70">
                    <span className="bg-black/40 px-2.5 py-1 rounded-lg border border-emerald-500/20">⚖️ {item.weight} kg</span>
                    <span className="bg-black/40 px-2.5 py-1 rounded-lg border border-emerald-500/20">⭐ {item.importance}/10</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
