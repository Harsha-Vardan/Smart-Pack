/**
 * 0/1 Knapsack Algorithm with Dynamic Programming
 * 
 * Solves the packing optimization problem:
 * Given items with weights and importance scores,
 * find the combination that maximizes total importance
 * while staying within the bag's weight capacity.
 * 
 * DP Formula:
 *   dp[i][w] = max(dp[i-1][w], dp[i-1][w - weight[i]] + value[i])
 * 
 * Time Complexity: O(n * W) where n = items, W = capacity
 * Space Complexity: O(n * W)
 */

function knapsack(items, capacity) {
  const n = items.length;

  if (n === 0 || capacity <= 0) {
    return {
      selectedItems: [],
      excludedItems: items.map(item => ({
        name: item.name,
        weight: item.weight,
        importance: item.importance,
        _id: item._id
      })),
      totalWeight: 0,
      totalImportance: 0,
      remainingCapacity: capacity,
      bagCapacity: capacity,
      dpTableSize: { rows: 0, cols: 0 },
      totalCombinations: 0
    };
  }

  // Scale weights to integers for DP (multiply by 10 for 0.1kg precision)
  const SCALE = 10;
  const scaledCapacity = Math.round(capacity * SCALE);
  const scaledWeights = items.map(item => Math.round(item.weight * SCALE));

  // Build DP table
  // dp[i][w] = maximum importance using first i items with capacity w
  const dp = Array(n + 1)
    .fill(null)
    .map(() => Array(scaledCapacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= scaledCapacity; w++) {
      // Don't take item i
      dp[i][w] = dp[i - 1][w];

      // Take item i (if it fits)
      if (scaledWeights[i - 1] <= w) {
        const withItem = dp[i - 1][w - scaledWeights[i - 1]] + items[i - 1].importance;
        if (withItem > dp[i][w]) {
          dp[i][w] = withItem;
        }
      }
    }
  }

  // Backtrack to find selected items
  const selected = [];
  const excluded = [];
  let w = scaledCapacity;

  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      // Item i was selected
      selected.push({
        name: items[i - 1].name,
        weight: items[i - 1].weight,
        importance: items[i - 1].importance,
        _id: items[i - 1]._id
      });
      w -= scaledWeights[i - 1];
    } else {
      // Item i was not selected
      excluded.push({
        name: items[i - 1].name,
        weight: items[i - 1].weight,
        importance: items[i - 1].importance,
        _id: items[i - 1]._id
      });
    }
  }

  // Calculate totals
  const totalWeight = selected.reduce((sum, item) => sum + item.weight, 0);
  const totalImportance = selected.reduce((sum, item) => sum + item.importance, 0);
  const roundedTotalWeight = Math.round(totalWeight * 10) / 10;

  return {
    selectedItems: selected.reverse(),
    excludedItems: excluded.reverse(),
    totalWeight: roundedTotalWeight,
    totalImportance,
    remainingCapacity: Math.round((capacity - roundedTotalWeight) * 10) / 10,
    bagCapacity: capacity,
    dpTableSize: { rows: n + 1, cols: scaledCapacity + 1 },
    totalCombinations: Math.pow(2, n)
  };
}

module.exports = knapsack;
