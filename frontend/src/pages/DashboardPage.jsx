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
import ParticleCanvas from '../components/ParticleCanvas';

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
      toast.success('Item added!');
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
      toast.success('Item deleted.');
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
      toast.success('Item updated!');
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
      toast.success('Bag capacity updated!');
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
      toast.success('Optimization complete!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Optimization failed.');
    } finally {
      setOptimizing(false);
    }
  };

  // Calculate used weight
  const usedWeight = items.reduce((sum, item) => sum + item.weight, 0);

  return (
    <div className="min-h-screen relative">
      <ParticleCanvas />
      <Navbar username={user?.username} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 relative z-10">
        {/* Capacity Section */}
        <CapacityBar
          bagCapacity={bagCapacity}
          usedWeight={usedWeight}
          onUpdate={handleUpdateCapacity}
        />

        {/* Grid: Add Item + Items List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <AddItemForm onAdd={handleAddItem} />
          <ItemsList
            items={items}
            loading={loadingItems}
            onDelete={handleDeleteItem}
            onEdit={(item) => setEditItem(item)}
          />
        </div>

        {/* Optimize Button */}
        <button
          onClick={handleOptimize}
          disabled={optimizing || items.length === 0}
          className="w-full gradient-btn text-white rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer relative overflow-hidden group mb-6 border-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <span className="text-3xl relative z-10">
            {optimizing ? (
              <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            ) : '⚡'}
          </span>
          <div className="text-left relative z-10">
            <span className="block text-lg font-bold">
              {optimizing ? 'Running Optimization...' : 'Run Smart Optimization'}
            </span>
            <span className="block text-xs opacity-70 mt-0.5">
              Uses 0/1 Knapsack Dynamic Programming Algorithm
            </span>
          </div>
        </button>

        {/* Results */}
        {results && <ResultsPanel results={results} />}
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
  );
}
