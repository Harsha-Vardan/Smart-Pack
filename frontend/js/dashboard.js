const API = window.location.origin + '/api';
const token = localStorage.getItem('ps_token');
const user = JSON.parse(localStorage.getItem('ps_user') || '{}');

// Auth guard
if (!token) { window.location.href = 'login.html'; }

// Set username in nav
document.getElementById('navUsername').textContent = user.username || 'User';

// Range slider display
const importanceSlider = document.getElementById('itemImportance');
const importanceVal = document.getElementById('importanceVal');
importanceSlider.addEventListener('input', () => { importanceVal.textContent = importanceSlider.value; });

function headers() { return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }; }

function toast(msg, type = 'success') {
  const container = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 3000);
}

function logout() {
  localStorage.removeItem('ps_token');
  localStorage.removeItem('ps_user');
  window.location.href = 'login.html';
}

// ── Load items ──
async function loadItems() {
  try {
    const res = await fetch(`${API}/items`, { headers: headers() });
    if (res.status === 401) { logout(); return; }
    const data = await res.json();
    renderItems(data.items);
    document.getElementById('bagCapacity').value = data.bagCapacity;
    updateCapacityBar(data.items, data.bagCapacity);
  } catch (err) { toast('Failed to load items', 'error'); }
}

function renderItems(items) {
  const list = document.getElementById('itemsList');
  document.getElementById('itemCount').textContent = `${items.length} items`;
  if (items.length === 0) {
    list.innerHTML = '<div class="empty-state"><div class="icon">📭</div><p>No items yet. Add your first item above!</p></div>';
    return;
  }
  list.innerHTML = items.map(item => `
    <div class="item-card" id="item-${item._id}">
      <div class="item-info">
        <h4>${item.name}</h4>
        <div class="item-meta">
          <span>⚖️ <strong>${item.weight} kg</strong></span>
          <span>⭐ <strong>${item.importance}/10</strong></span>
        </div>
      </div>
      <div class="item-actions">
        <button class="btn-icon" onclick="editItem('${item._id}','${item.name}',${item.weight},${item.importance})" title="Edit">✏️</button>
        <button class="btn-icon" onclick="deleteItem('${item._id}')" title="Delete">🗑️</button>
      </div>
    </div>
  `).join('');
}

function updateCapacityBar(items, capacity) {
  const totalWeight = items ? items.reduce((s, i) => s + i.weight, 0) : 0;
  const pct = capacity > 0 ? Math.min((totalWeight / capacity) * 100, 100) : 0;
  const fill = document.getElementById('capacityFill');
  fill.style.width = pct + '%';
  fill.className = 'capacity-fill' + (pct > 90 ? ' warning' : '');
  document.getElementById('capacityText').textContent = `${Math.round(totalWeight * 10) / 10} / ${capacity} kg`;
}

// ── Add Item ──
async function addItem() {
  const name = document.getElementById('itemName').value.trim();
  const weight = parseFloat(document.getElementById('itemWeight').value);
  const importance = parseInt(importanceSlider.value);
  if (!name) { toast('Enter an item name', 'error'); return; }
  if (!weight || weight <= 0) { toast('Enter a valid weight', 'error'); return; }
  try {
    const res = await fetch(`${API}/items`, { method: 'POST', headers: headers(), body: JSON.stringify({ name, weight, importance }) });
    const data = await res.json();
    if (!res.ok) { toast(data.message, 'error'); return; }
    toast(`${name} added!`);
    document.getElementById('itemName').value = '';
    document.getElementById('itemWeight').value = '';
    importanceSlider.value = 5; importanceVal.textContent = '5';
    renderItems(data.items);
    updateCapacityBar(data.items, parseFloat(document.getElementById('bagCapacity').value));
  } catch { toast('Failed to add item', 'error'); }
}

// ── Edit Item ──
async function editItem(id, name, weight, importance) {
  const newName = prompt('Item name:', name);
  if (newName === null) return;
  const newWeight = prompt('Weight (kg):', weight);
  if (newWeight === null) return;
  const newImportance = prompt('Importance (1-10):', importance);
  if (newImportance === null) return;
  try {
    const res = await fetch(`${API}/items/${id}`, {
      method: 'PUT', headers: headers(),
      body: JSON.stringify({ name: newName, weight: parseFloat(newWeight), importance: parseInt(newImportance) })
    });
    const data = await res.json();
    if (!res.ok) { toast(data.message, 'error'); return; }
    toast('Item updated!');
    renderItems(data.items);
    updateCapacityBar(data.items, parseFloat(document.getElementById('bagCapacity').value));
  } catch { toast('Failed to update item', 'error'); }
}

// ── Delete Item ──
async function deleteItem(id) {
  if (!confirm('Delete this item?')) return;
  try {
    const res = await fetch(`${API}/items/${id}`, { method: 'DELETE', headers: headers() });
    const data = await res.json();
    if (!res.ok) { toast(data.message, 'error'); return; }
    toast('Item deleted!');
    renderItems(data.items);
    updateCapacityBar(data.items, parseFloat(document.getElementById('bagCapacity').value));
  } catch { toast('Failed to delete item', 'error'); }
}

// ── Update Capacity ──
async function updateCapacity() {
  const capacity = parseFloat(document.getElementById('bagCapacity').value);
  if (!capacity || capacity <= 0) { toast('Enter a valid capacity', 'error'); return; }
  try {
    const res = await fetch(`${API}/items/bag-capacity/update`, {
      method: 'PUT', headers: headers(), body: JSON.stringify({ capacity })
    });
    if (!res.ok) { toast('Failed to update capacity', 'error'); return; }
    toast('Capacity updated!');
    loadItems();
  } catch { toast('Failed to update capacity', 'error'); }
}

// ── Optimize ──
async function optimize() {
  const btn = document.getElementById('optimizeBtn');
  btn.disabled = true; btn.textContent = '⏳ Optimizing...';
  try {
    const res = await fetch(`${API}/optimize`, { method: 'POST', headers: headers() });
    const data = await res.json();
    if (!res.ok) { toast(data.message, 'error'); btn.disabled = false; btn.textContent = '⚡ Optimize Packing'; return; }
    showResults(data.result);
    toast('Optimization complete!');
  } catch { toast('Optimization failed', 'error'); }
  btn.disabled = false; btn.textContent = '⚡ Optimize Packing';
}

function showResults(r) {
  const panel = document.getElementById('resultsPanel');
  panel.classList.add('show');
  document.getElementById('statsGrid').innerHTML = `
    <div class="stat-card"><div class="stat-value">${r.selectedItems.length}</div><div class="stat-label">Items Selected</div></div>
    <div class="stat-card"><div class="stat-value">${r.totalWeight} kg</div><div class="stat-label">Total Weight</div></div>
    <div class="stat-card"><div class="stat-value">${r.totalImportance}</div><div class="stat-label">Total Score</div></div>
    <div class="stat-card"><div class="stat-value">${r.remainingCapacity} kg</div><div class="stat-label">Remaining</div></div>
  `;
  document.getElementById('selectedSection').innerHTML = `
    <h3>✅ Pack These Items</h3>
    ${r.selectedItems.map(i => `<div class="result-item selected"><span class="ri-name">${i.name}</span><div class="ri-meta"><span>⚖️ ${i.weight} kg</span><span>⭐ ${i.importance}</span></div></div>`).join('')}
  `;
  document.getElementById('excludedSection').innerHTML = r.excludedItems.length ? `
    <h3>❌ Leave Behind</h3>
    ${r.excludedItems.map(i => `<div class="result-item excluded"><span class="ri-name">${i.name}</span><div class="ri-meta"><span>⚖️ ${i.weight} kg</span><span>⭐ ${i.importance}</span></div></div>`).join('')}
  ` : '';
  document.getElementById('processingInfo').innerHTML = `Processed in ${r.processingTime} | DP Table: ${r.dpTableSize.rows} × ${r.dpTableSize.cols} | ${r.totalCombinations.toLocaleString()} combinations evaluated`;
  panel.scrollIntoView({ behavior: 'smooth' });
}

// Initial load
loadItems();
