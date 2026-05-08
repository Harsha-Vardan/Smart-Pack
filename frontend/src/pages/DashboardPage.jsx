import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getItems, addItem, deleteItem, updateItem, updateBagCapacity, runOptimize } from '../services/api';
import Navbar from '../components/Navbar';
import CapacityBar from '../components/CapacityBar';
import AddItemForm from '../components/AddItemForm';
import ItemsList from '../components/ItemsList';
import ResultsPanel from '../components/ResultsPanel';
import EditModal from '../components/EditModal';

export default function DashboardPage() {
  const { user } = useAuth();
  const toast = useToast();

  const [items, setItems] = useState([]);
  const [bagCapacity, setBagCapacity] = useState(10);
  const [results, setResults] = useState(null);
  const [loadingItems, setLoadingItems] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Fetch items on mount
  const fetchItems = useCallback(async () => {
    try {
      const res = await getItems();
      setItems(res.data.items);
      setBagCapacity(res.data.bagCapacity);
    } catch {
      toast.error('Failed to load items.');
    } finally {
      setLoadingItems(false);
    }
  }, [toast]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  // Add item
  const handleAddItem = async (name, weight, importance) => {
    try {
      const res = await addItem(name, weight, importance);
      setItems(res.data.items);
      setResults(null);
      toast.success('Item added to inventory.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add item.');
    }
  };

  // Delete item
  const handleDeleteItem = async (id) => {
    try {
      const res = await deleteItem(id);
      setItems(res.data.items);
      setResults(null);
      toast.info('Item removed.');
    } catch {
      toast.error('Failed to delete item.');
    }
  };

  // Update item
  const handleUpdateItem = async (id, data) => {
    try {
      const res = await updateItem(id, data);
      setItems(res.data.items);
      setEditItem(null);
      setResults(null);
      toast.success('Item updated successfully.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update item.');
    }
  };

  // Update capacity
  const handleUpdateCapacity = async (capacity) => {
    try {
      const res = await updateBagCapacity(capacity);
      setBagCapacity(res.data.bagCapacity);
      setResults(null);
      toast.success('Capacity limit set.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update capacity.');
    }
  };

  // Run optimization
  const handleOptimize = async () => {
    setOptimizing(true);
    try {
      const res = await runOptimize();
      setResults(res.data.result);
      toast.success('Optimal configuration found!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Optimization failed.');
    } finally {
      setOptimizing(false);
    }
  };

  // Calculate used weight
  const usedWeight = items.reduce((sum, item) => sum + item.weight, 0);

  return (
    <div className="min-h-screen relative bg-[#050505]">
      <div className="ambient-bg" />
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIvPjwvc3ZnPg==')] pointer-events-none z-0 mix-blend-screen" />

      <div className="relative z-10 flex flex-col min-h-screen pb-24">
        <Navbar username={user?.username} />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 w-full flex-1">
          {/* Header Area */}
          <div className="text-center mb-10 animate-slide-up mt-4">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Luggage <span className="gradient-text">Optimizer</span>
            </h1>
            <p className="text-slate-400 max-w-xl mx-auto font-medium">
              Configure your bag capacity and add items. Our algorithm will determine the absolute best combination.
            </p>
          </div>

          {/* Top: Capacity */}
          <CapacityBar
            bagCapacity={bagCapacity}
            usedWeight={usedWeight}
            onUpdate={handleUpdateCapacity}
          />

          {/* Grid: Add Item + Items List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <AddItemForm onAdd={handleAddItem} />
            <ItemsList
              items={items}
              loading={loadingItems}
              onDelete={handleDeleteItem}
              onEdit={(item) => setEditItem(item)}
            />
          </div>

          {/* Big Optimize Button */}
          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={handleOptimize}
              disabled={optimizing || items.length === 0}
              className="group w-full gradient-btn rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-center gap-5 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer relative overflow-hidden border border-white/10"
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] bg-no-repeat transition-[background-position_0s_ease] hover:bg-[position:200%_0,0_0] duration-[1500ms]" />
              
              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-500 relative z-10">
                {optimizing ? (
                  <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">⚡</span>
                )}
              </div>
              
              <div className="text-center sm:text-left relative z-10">
                <span className="block text-2xl font-black text-white tracking-tight drop-shadow-md mb-1">
                  {optimizing ? 'Computing Matrix...' : 'Run Smart Optimization'}
                </span>
                <span className="block text-sm font-semibold text-white/70 uppercase tracking-widest">
                  Powered by 0/1 Knapsack Algorithm
                </span>
              </div>
            </button>
          </div>

          {/* Results Area */}
          {results && (
            <div id="results" className="scroll-mt-8">
              <ResultsPanel results={results} />
            </div>
          )}
        </main>

        {/* Edit Modal */}
        {editItem && (
          <EditModal
            item={editItem}
            onSave={handleUpdateItem}
            onClose={() => setEditItem(null)}
          />
        )}
      </div>
    </div>
  );
}
