
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronDown, ChevronRight, Calculator, CheckSquare, Square, Info, Divide, X } from 'lucide-react';

// Elixir Tier Configuration
const ELIXIR_TIERS_CONFIG = [
  { name: 'Common', refPoints: 1, order: 0, colorClass: 'bg-gray-400 dark:bg-gray-600' },
  { name: 'Good', refPoints: 2, order: 1, colorClass: 'bg-lime-300 dark:bg-lime-500' },
  { name: 'Sturdy', refPoints: 3, order: 2, colorClass: 'bg-sky-300 dark:bg-sky-500' },
  { name: 'Rare', refPoints: 4, order: 3, colorClass: 'bg-green-500 dark:bg-green-700' },
  { name: 'Perfect', refPoints: 5, order: 4, colorClass: 'bg-blue-800 dark:bg-blue-600' },
  { name: 'Scarce', refPoints: 6, order: 5, colorClass: 'bg-pink-200 dark:bg-pink-400' },
  { name: 'Epic', refPoints: 8, order: 6, colorClass: 'bg-orange-300 dark:bg-orange-500' },
  { name: 'Legendary', refPoints: 10, order: 7, colorClass: 'bg-purple-600 dark:bg-purple-800' },
  { name: 'Immortal', refPoints: 14, order: 8, colorClass: 'bg-pink-500 dark:bg-pink-700' },
  { name: 'Myth', refPoints: 20, order: 9, colorClass: 'bg-orange-700 dark:bg-orange-900' },
  { name: 'Eternal', refPoints: 28, order: 10, colorClass: 'bg-yellow-400 dark:bg-yellow-600' },
].sort((a, b) => a.order - b.order); // Ensure sorted by tier value

// Elixir Types Configuration
const ELIXIR_TYPES_CONFIG = [
  { name: 'CD', color: 'bg-blue-500' },
  { name: 'ATK', color: 'bg-red-500' },
  { name: 'TD', color: 'bg-green-500' },
  { name: 'SD', color: 'bg-yellow-500' },
  { name: 'HP', color: 'bg-purple-500' },
];

// Helper to get ref points by tier name
const getRefPointsForTier = (tierName) => {
  const tier = ELIXIR_TIERS_CONFIG.find(t => t.name === tierName);
  return tier ? tier.refPoints : 0;
};

// --- Components ---

// Elixir Input Item Component
const ElixirInputItem = React.memo(({ elixirType, tier, quantity, onInventoryChange }) => {
  const handleChange = useCallback((e) => {
    const value = e.target.value;
    if (value === '' || /^(\d+)?$/.test(value)) { // Allow empty string or digits
      onInventoryChange(elixirType, tier.name, value === '' ? '' : parseInt(value, 10));
    }
  }, [elixirType, tier.name, onInventoryChange]);

  const handleBlur = useCallback(() => {
    if (quantity === '') {
      onInventoryChange(elixirType, tier.name, 0);
    }
  }, [elixirType, tier.name, quantity, onInventoryChange]);

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0 px-4">
      <div className="flex items-center flex-grow">
        <span className={`w-3 h-3 rounded-full mr-2 ${tier.colorClass}`}></span>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 dark:text-gray-200">{tier.name}</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">{tier.refPoints} Ref Points</span>
        </div>
      </div>
      <input
        type="number"
        min="0"
        value={quantity}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-24 px-3 py-2 text-center rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-base shadow-sm"
        aria-label={`Quantity of ${tier.name} ${elixirType} elixirs`}
      />
    </div>
  );
});

// Elixir Type Inventory Component
const ElixirTypeInventory = React.memo(({ elixirTypeConfig, inventoryForType, onInventoryChange, totalRefPointsForType }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return (
    <div className="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-auto">
      <button
        className="flex justify-between items-center w-full p-4 text-left font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-t-lg transition-all duration-200"
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-controls={`elixir-type-${elixirTypeConfig.name}-inventory`}
      >
        <span className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${elixirTypeConfig.color}`}></span>
          {elixirTypeConfig.name} Elixirs
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-400">Total: {totalRefPointsForType.toLocaleString()} Ref Points</span>
        {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </button>
      <div
        id={`elixir-type-${elixirTypeConfig.name}-inventory`}
        className={`transition-all duration-300 ease-in-out overflow-auto ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`} // Max height for scrollability
      >
        <div className="border-t border-gray-200 dark:border-gray-700">
          {ELIXIR_TIERS_CONFIG.map((tier) => (
            <ElixirInputItem
              key={tier.name}
              elixirType={elixirTypeConfig.name}
              tier={tier}
              quantity={inventoryForType[tier.name] ?? 0}
              onInventoryChange={onInventoryChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

// Elixir Inventory Management Interface Component
const ElixirInventory = React.memo(({ inventory, onInventoryChange, totalRefPointsPerType }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden mb-6 border border-gray-200 dark:border-gray-700 p-4 overflow-y-auto"> {/* Overall scrollability */}
      <h2 className="text-xl font-bold p-4 -mx-4 -mt-4 mb-4 bg-indigo-600 text-white rounded-t-xl">Your Elixir Inventories</h2>
      {ELIXIR_TYPES_CONFIG.map((typeConfig) => (
        <ElixirTypeInventory
          key={typeConfig.name}
          elixirTypeConfig={typeConfig}
          inventoryForType={inventory[typeConfig.name] || {}}
          onInventoryChange={onInventoryChange} // This is the corrected line
          totalRefPointsForType={totalRefPointsPerType[typeConfig.name] || 0}
        />
      ))}
    </div>
  );
});

// Total Summary Display Component
const TotalSummaryDisplay = React.memo(({ totalOverallRefPoints, totalRefPointsPerType }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700 mb-6">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Overall Total Reference Points</h2>
      <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 transition-transform duration-300 hover:scale-105 mb-4">
        {totalOverallRefPoints.toLocaleString()}
      </p>

      <button
        className="flex items-center justify-center w-full text-indigo-600 dark:text-indigo-400 font-medium py-2 rounded-md hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200"
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-controls="per-type-summary"
      >
        {isOpen ? 'Hide Per-Type Summary' : 'Show Per-Type Summary'}
        {isOpen ? <ChevronDown size={18} className="ml-2" /> : <ChevronRight size={18} className="ml-2" />}
      </button>

      <div
        id="per-type-summary"
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
      >
        <ul className="text-left space-y-1">
          {ELIXIR_TYPES_CONFIG.map(typeConfig => (
            <li key={typeConfig.name} className="flex justify-between items-center text-gray-700 dark:text-gray-300">
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${typeConfig.color}`}></span>
                {typeConfig.name}:
              </span>
              <span className="font-semibold">{totalRefPointsPerType[typeConfig.name]?.toLocaleString() || 0}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});


// Optimal Elixir Selection Calculator Component
const OptimalSelectionCalculator = React.memo(({ inventory, totalOverallRefPoints }) => {
  const [targetRefPoints, setTargetRefPoints] = useState('');
  const [selectedElixirTypes, setSelectedElixirTypes] = useState(() =>
    new Set(ELIXIR_TYPES_CONFIG.map(type => type.name))
  );
  const [resultElixirs, setResultElixirs] = useState({});
  const [achievedPoints, setAchievedPoints] = useState(0);
  const [message, setMessage] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  const handleTargetChange = useCallback((e) => {
    const value = e.target.value;
    if (value === '' || /^(\d+)?$/.test(value)) {
      setTargetRefPoints(value);
    }
  }, []);

  const handleTypeSelectionChange = useCallback((typeName, isChecked) => {
    setSelectedElixirTypes(prev => {
      const newSelection = new Set(prev);
      if (isChecked) {
        newSelection.add(typeName);
      } else {
        newSelection.delete(typeName);
      }
      return newSelection;
    });
  }, []);

  const calculateOptimalSelection = useCallback(() => {
    setIsCalculating(true);
    setResultElixirs({});
    setAchievedPoints(0);
    setMessage('');

    const target = parseInt(targetRefPoints, 10);

    if (isNaN(target) || target <= 0) {
      setMessage('Please enter a valid positive target reference point.');
      setIsCalculating(false);
      return;
    }

    if (selectedElixirTypes.size === 0) {
      setMessage('Please select at least one elixir type for the calculation.');
      setIsCalculating(false);
      return;
    }

    // Flatten and filter available elixirs from selected types
    const availableElixirs = [];
    let currentTotalSelectedInventoryRefPoints = 0;

    for (const typeName of selectedElixirTypes) {
      const typeInventory = inventory[typeName] || {};
      for (const tier of ELIXIR_TIERS_CONFIG) {
        const quantity = typeInventory[tier.name] ?? 0;
        if (quantity > 0) {
          availableElixirs.push({
            type: typeName,
            tier: tier.name,
            refPoints: tier.refPoints,
            quantity: quantity,
            order: tier.order // Keep order for sorting
          });
          currentTotalSelectedInventoryRefPoints += quantity * tier.refPoints;
        }
      }
    }

    if (currentTotalSelectedInventoryRefPoints < target) {
      setMessage(`Target (${target.toLocaleString()}) cannot be reached with the selected elixir types. Max achievable: ${currentTotalSelectedInventoryRefPoints.toLocaleString()}.`);
      setIsCalculating(false);
      return;
    }

    // Sort available elixirs by refPoints (and then by order for consistency)
    availableElixirs.sort((a, b) => {
      if (a.refPoints !== b.refPoints) {
        return a.refPoints - b.refPoints;
      }
      return a.order - b.order;
    });

    let currentAchievedPoints = 0;
    const selectedElixirs = {}; // { type: { tier: quantity } }

    for (const elixir of availableElixirs) {
        // If we've already met or exceeded the target, we break.
        // The algorithm aims for the closest number higher, so it will take just enough to cross the target.
        if (currentAchievedPoints >= target) {
            break; 
        }

        const refPointsPerElixir = elixir.refPoints;
        const availableQuantity = elixir.quantity;

        // How many more points do we minimally need to reach or exceed the target?
        const pointsNeededToMeetTarget = target - currentAchievedPoints;
        
        let numToTake = 0;
        if (pointsNeededToMeetTarget > 0) {
            numToTake = Math.ceil(pointsNeededToMeetTarget / refPointsPerElixir);
        } else {
            numToTake = 0; // Should not be hit due to `currentAchievedPoints >= target` break.
        }
        
        numToTake = Math.min(numToTake, availableQuantity);

        if (numToTake > 0) {
            if (!selectedElixirs[elixir.type]) {
                selectedElixirs[elixir.type] = {};
            }
            selectedElixirs[elixir.type][elixir.tier] = (selectedElixirs[elixir.type][elixir.tier] || 0) + numToTake;
            currentAchievedPoints += numToTake * refPointsPerElixir;
        }
    }

    setResultElixirs(selectedElixirs);
    setAchievedPoints(currentAchievedPoints);

    if (currentAchievedPoints === target) {
      setMessage(`Successfully achieved exactly ${currentAchievedPoints.toLocaleString()} reference points.`);
    } else if (currentAchievedPoints > target) {
      setMessage(`Achieved ${currentAchievedPoints.toLocaleString()} reference points (Target: ${target.toLocaleString()}). This is the closest value higher than your target.`);
    } else { // currentAchievedPoints < target (should ideally be caught earlier if target > total available)
      setMessage(`Could not reach target. Achieved ${currentAchievedPoints.toLocaleString()} points. Max possible with selected types: ${currentTotalSelectedInventoryRefPoints.toLocaleString()}.`);
    }
    setIsCalculating(false);
  }, [inventory, targetRefPoints, selectedElixirTypes]);

  // UseEffect to trigger calculation when inputs change
  useEffect(() => {
    const handler = setTimeout(() => {
      if (targetRefPoints !== '' && parseInt(targetRefPoints, 10) > 0 && selectedElixirTypes.size > 0) {
        calculateOptimalSelection();
      } else {
        setResultElixirs({});
        setAchievedPoints(0);
        setMessage('');
      }
    }, 500); // Debounce calculation for 500ms

    return () => {
      clearTimeout(handler);
    };
  }, [targetRefPoints, selectedElixirTypes, calculateOptimalSelection]);


  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <Calculator size={24} className="text-indigo-600 dark:text-indigo-400" /> Optimal Elixir Selection
      </h2>
      
      <div className="mb-4">
        <label htmlFor="targetPoints" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Target Reference Points
        </label>
        <input
          id="targetPoints"
          type="number"
          min="1"
          value={targetRefPoints}
          onChange={handleTargetChange}
          className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-base shadow-sm"
          placeholder="e.g., 5000"
          aria-describedby="target-points-help"
        />
        <p id="target-points-help" className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Enter the reference points you wish to achieve.
        </p>
      </div>

      <div className="mb-6">
        <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Include Elixir Types:
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {ELIXIR_TYPES_CONFIG.map(typeConfig => (
            <label key={typeConfig.name} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedElixirTypes.has(typeConfig.name)}
                onChange={(e) => handleTypeSelectionChange(typeConfig.name, e.target.checked)}
                className="sr-only" // Hide default checkbox
              />
              <span className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all duration-150 ease-in-out ${
                selectedElixirTypes.has(typeConfig.name)
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
              }`}>
                {selectedElixirTypes.has(typeConfig.name) ? <CheckSquare size={16} /> : <Square size={16} />}
              </span>
              <span className="text-gray-700 dark:text-gray-300 text-sm">{typeConfig.name}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={calculateOptimalSelection}
        disabled={isCalculating || targetRefPoints === '' || parseInt(targetRefPoints, 10) <= 0 || selectedElixirTypes.size === 0}
        className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        aria-live="polite"
      >
        {isCalculating ? 'Calculating...' : (
          <>
            <Calculator size={20} /> Calculate Optimal Usage
          </>
        )}
      </button>

      {message && (
        <p className={`mt-4 flex items-center gap-2 text-sm font-medium ${achievedPoints < parseInt(targetRefPoints, 10) ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
          <Info size={16} /> {message}
        </p>
      )}

      {Object.keys(resultElixirs).length > 0 && (
        <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Elixirs to Use:</h3>
          {ELIXIR_TYPES_CONFIG.map(typeConfig => {
            const tiersForType = resultElixirs[typeConfig.name];
            if (!tiersForType || Object.keys(tiersForType).length === 0) return null;

            return (
              <div key={typeConfig.name} className="mb-2 last:mb-0">
                <p className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
                  <span className={`w-2.5 h-2.5 rounded-full ${typeConfig.color}`}></span>
                  {typeConfig.name}
                </p>
                <ul className="pl-6 space-y-0.5 text-sm">
                  {ELIXIR_TIERS_CONFIG.map(tier => {
                    const quantity = tiersForType[tier.name];
                    return quantity > 0 ? (
                      <li key={tier.name} className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>{tier.name}:</span>
                        <span className="font-medium">{quantity.toLocaleString()} pcs</span>
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
            );
          })}
          <p className="mt-4 text-lg font-bold text-indigo-600 dark:text-indigo-400 border-t pt-3 border-gray-200 dark:border-gray-600">
            Achieved Ref Points: {achievedPoints.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
});

// New Component: Elixir Point Calculator
const ElixirPointCalculator = React.memo(() => {
  const [currentPoints, setCurrentPoints] = useState('');
  const [coefficient, setCoefficient] = useState('');
  const [operation, setOperation] = useState('multiply'); // 'multiply' or 'divide'
  const [result, setResult] = useState(0);
  const [error, setError] = useState('');

  const calculateResult = useCallback(() => {
    const cp = parseFloat(currentPoints);
    const co = parseFloat(coefficient);

    if (isNaN(cp) || isNaN(co)) {
      setResult(0);
      setError('Please enter valid numbers for points and coefficient.');
      return;
    }

    if (operation === 'divide' && co === 0) {
      setResult(0);
      setError('Cannot divide by zero.');
      return;
    }

    setError('');
    if (operation === 'multiply') {
      setResult(cp * co);
    } else { // divide
      setResult(cp / co);
    }
  }, [currentPoints, coefficient, operation]);

  useEffect(() => {
    const handler = setTimeout(() => {
      calculateResult();
    }, 300); // Debounce calculation

    return () => clearTimeout(handler);
  }, [currentPoints, coefficient, operation, calculateResult]);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <X size={24} className="text-indigo-600 dark:text-indigo-400" /> <Divide size={24} className="text-indigo-600 dark:text-indigo-400" /> Elixir Point Conversion
      </h2>

      <div className="mb-4">
        <label htmlFor="calcCurrentPoints" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Elixir Points
        </label>
        <input
          id="calcCurrentPoints"
          type="number"
          value={currentPoints}
          onChange={(e) => setCurrentPoints(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-base shadow-sm"
          placeholder="e.g., 1000"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="calcCoefficient" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Rate
        </label>
        <input
          id="calcCoefficient"
          type="number"
          value={coefficient}
          onChange={(e) => setCoefficient(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-base shadow-sm"
          placeholder="e.g., 1.5"
        />
      </div>

      <div className="mb-6">
        <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Operation:</p>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="operation"
              value="multiply"
              checked={operation === 'multiply'}
              onChange={() => setOperation('multiply')}
              className="form-radio text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            />
            <span className="text-gray-700 dark:text-gray-300">Multiply</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="operation"
              value="divide"
              checked={operation === 'divide'}
              onChange={() => setOperation('divide')}
              className="form-radio text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            />
            <span className="text-gray-700 dark:text-gray-300">Divide</span>
          </label>
        </div>
      </div>

      {error && (
        <p className="mt-4 flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400">
          <Info size={16} /> {error}
        </p>
      )}

      <p className="mt-4 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
        Result: <span className="font-extrabold">{result.toLocaleString()}</span>
      </p>
    </div>
  );
});


// Main App Component
const ElixirTrackerApp = () => {
  // Initialize inventory state from localStorage or with default values
  const [inventory, setInventory] = useState(() => {
    try {
      const savedInventory = localStorage.getItem('elixirTrackerInventory');
      if (savedInventory) {
        return JSON.parse(savedInventory);
      }
    } catch (error) {
      console.error("Failed to parse inventory from localStorage", error);
      // Fallback to initial inventory if localStorage is corrupted
    }
    const initialInventory = {};
    ELIXIR_TYPES_CONFIG.forEach(typeConfig => {
      initialInventory[typeConfig.name] = {};
      ELIXIR_TIERS_CONFIG.forEach(tier => {
        initialInventory[typeConfig.name][tier.name] = 0;
      });
    });

    // Example initial data
    initialInventory['CD']['Myth'] = 0;
    initialInventory['CD']['Immortal'] = 0;
    initialInventory['CD']['Legendary'] = 0;
    initialInventory['CD']['Epic'] = 0;
    initialInventory['CD']['Scarce'] = 0;

    initialInventory['ATK']['Myth'] = 0;
    initialInventory['ATK']['Immortal'] = 0;
    initialInventory['ATK']['Legendary'] = 0;
    initialInventory['ATK']['Epic'] = 0;
    initialInventory['ATK']['Scarce'] = 0;
    initialInventory['ATK']['Perfect'] = 0;

    initialInventory['TD']['Sturdy'] = 0;
    initialInventory['TD']['Rare'] = 0;

    initialInventory['SD']['Common'] = 0;
    initialInventory['SD']['Good'] = 0;

    initialInventory['HP']['Eternal'] = 0;
    initialInventory['HP']['Myth'] = 0;

    return initialInventory;
  });

  // Effect to save inventory to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('elixirTrackerInventory', JSON.stringify(inventory));
    } catch (error) {
      console.error("Failed to save inventory to localStorage", error);
    }
  }, [inventory]);

  // Calculate total reference points per type
  const totalRefPointsPerType = useMemo(() => {
    const totals = {};
    ELIXIR_TYPES_CONFIG.forEach(typeConfig => {
      const typeInventory = inventory[typeConfig.name] || {};
      totals[typeConfig.name] = ELIXIR_TIERS_CONFIG.reduce((sum, tier) => {
        const quantity = typeInventory[tier.name] ?? 0;
        return sum + (quantity * tier.refPoints);
      }, 0);
    });
    return totals;
  }, [inventory]);

  // Calculate overall total reference points
  const totalOverallRefPoints = useMemo(() => {
    return Object.values(totalRefPointsPerType).reduce((sum, current) => sum + current, 0);
  }, [totalRefPointsPerType]);

  // Handler for updating elixir quantities
  const handleInventoryChange = useCallback((elixirType, tierName, newQuantity) => {
    setInventory(prevInventory => ({
      ...prevInventory,
      [elixirType]: {
        ...prevInventory[elixirType],
        [tierName]: newQuantity,
      },
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 font-sans">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-700 dark:text-indigo-300 mb-2 leading-tight">
          Elixir Inventory Tracker
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Manage your elixirs by type, track points, and optimize usage for targets.
        </p>
      </header>

      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Inventory Management */}
        <section>
          <ElixirInventory
            inventory={inventory}
            onInventoryChange={handleInventoryChange}
            totalRefPointsPerType={totalRefPointsPerType}
          />
        </section>

        {/* Right Column - Summary, Optimal Selection, and New Elixir Point Calculator */}
        <section className="flex flex-col gap-6">
          <TotalSummaryDisplay
            totalOverallRefPoints={totalOverallRefPoints}
            totalRefPointsPerType={totalRefPointsPerType}
          />
          <OptimalSelectionCalculator
            inventory={inventory}
            totalOverallRefPoints={totalOverallRefPoints}
          />
          <ElixirPointCalculator /> {/* New Elixir Point Calculator Component */}
        </section>
      </main>

      <footer className="text-center mt-10 text-gray-500 dark:text-gray-600 text-sm py-4">
        &copy; {new Date().getFullYear()} Elixir Tracker. All rights reserved.
      </footer>
    </div>
  );
};

export default ElixirTrackerApp;

