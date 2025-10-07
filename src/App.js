
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronDown, ChevronRight, Calculator, Info, Divide, X } from 'lucide-react';

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
  { name: 'CD', color: 'bg-pink-500' },
  { name: 'ATK', color: 'bg-red-500' },
  { name: 'TD', color: 'bg-blue-500' },
  { name: 'SD', color: 'bg-purple-500' },
  { name: 'HP', color: 'bg-green-500' },
];

const ELIXIR_ABSORB_STATS_CONFIG = {
  'ATK': {
    'Common': 100, 'Good': 200, 'Sturdy': 300, 'Rare': 400, 'Perfect': 600,
    'Scarce': 800, 'Epic': 1200, 'Legendary': 1600, 'Immortal': 2400,
    'Myth': 4000, 'Eternal': 6000
  },
  'CD': {
    'Common': 0.01, 'Good': 0.02, 'Sturdy': 0.03, 'Rare': 0.04, 'Perfect': 0.05,
    'Scarce': 0.06, 'Epic': 0.08, 'Legendary': 0.10, 'Immortal': 0.14,
    'Myth': 0.20, 'Eternal': 0.28
  },
  'TD': {
    'Common': 0.001, 'Good': 0.002, 'Sturdy': 0.003, 'Rare': 0.004, 'Perfect': 0.005,
    'Scarce': 0.006, 'Epic': 0.008, 'Legendary': 0.010, 'Immortal': 0.014,
    'Myth': 0.020, 'Eternal': 0.028
  },
  'SD': {
    'Common': 0.002, 'Good': 0.004, 'Sturdy': 0.006, 'Rare': 0.008, 'Perfect': 0.010,
    'Scarce': 0.012, 'Epic': 0.016, 'Legendary': 0.020, 'Immortal': 0.028,
    'Myth': 0.040, 'Eternal': 0.056
  },
  'HP': {
    'Common': 10000, 'Good': 20000, 'Sturdy': 30000, 'Rare': 40000, 'Perfect': 60000,
    'Scarce': 80000, 'Epic': 120000, 'Legendary': 160000, 'Immortal': 240000,
    'Myth': 400000, 'Eternal': 600000
  }
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
const ElixirTypeInventory = React.memo(({ elixirTypeConfig, inventoryForType, onInventoryChange, totalRefPointsForType, onClearTypeInventory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  const handleClear = useCallback(() => {
    onClearTypeInventory(elixirTypeConfig.name);
  }, [elixirTypeConfig.name, onClearTypeInventory]);
  return (
    <div className="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div // Use a div here to contain button and clear button
        className="flex justify-between items-center w-full p-4 text-left font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-t-lg transition-all duration-200"
      >
        <button // Main toggle button for accordion
          onClick={toggleOpen}
          aria-expanded={isOpen}
          aria-controls={`elixir-type-${elixirTypeConfig.name}-inventory`}
          className="flex-grow flex items-center gap-2 focus:outline-none" // Added flex-grow
        >
          <span className={`w-3 h-3 rounded-full ${elixirTypeConfig.color}`}></span>
          {elixirTypeConfig.name}
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-400 mr-4">{totalRefPointsForType.toLocaleString()} Points</span>
        <button // Clear button
          onClick={handleClear}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          aria-label={`Clear all ${elixirTypeConfig.name} elixirs`}
        >
          Clear
        </button>
        <button // Chevron for accordion
          onClick={toggleOpen}
          className="ml-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
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
const ElixirInventory = React.memo(({ inventory, onInventoryChange, totalRefPointsPerType, onClearAllElixirs,onClearTypeInventory }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden mb-6 border border-gray-200 dark:border-gray-700 p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
      <div className="flex items-center justify-between p-4 -mx-4 -mt-4 mb-4 bg-indigo-600 text-white rounded-t-xl">
        <h2 className="text-xl font-bold">Elixir</h2>
        <button
          onClick={onClearAllElixirs} // Call the new handler
          className="px-3 py-1 bg-indigo-500 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          aria-label="Clear all elixir inputs"
        >
          Clear All
        </button>
      </div>
      {ELIXIR_TYPES_CONFIG.map((typeConfig) => (
        <ElixirTypeInventory
          key={typeConfig.name}
          elixirTypeConfig={typeConfig}
          inventoryForType={inventory[typeConfig.name] || {}}
          onInventoryChange={onInventoryChange}
          totalRefPointsForType={totalRefPointsPerType[typeConfig.name] || 0}
          onClearTypeInventory = {onClearTypeInventory}
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
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Overall Total Ref Points</h2>
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
    new Set() // Initialize as empty set as per your last request
  );
  const [resultElixirs, setResultElixirs] = useState({});
  const [achievedPoints, setAchievedPoints] = useState(0);
  const [message, setMessage] = useState('');
  // const [isCalculating, setIsCalculating] = useState(false);

  const handleTargetChange = useCallback((e) => {
    const value = e.target.value;
    if (value === '' || /^(\d+)?$/.test(value)) {
      setTargetRefPoints(value);
    }
  }, []);

  const handleTypeSelectionChange = useCallback((typeName) => {
    setSelectedElixirTypes(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(typeName)) {
        newSelection.delete(typeName);
      } else {
        newSelection.add(typeName);
      }
      return newSelection;
    });
  }, []);

  const calculateOptimalSelection = useCallback(() => {
    // setIsCalculating(true);
    setResultElixirs({});
    setAchievedPoints(0);
    setMessage('');

    const target = parseInt(targetRefPoints, 10);

    if (isNaN(target) || target <= 0) {
      setMessage('Please enter a valid positive target reference point.');
      // setIsCalculating(false);
      return;
    }

    if (selectedElixirTypes.size === 0) {
      setMessage('Please select at least one elixir type for the calculation.');
      // setIsCalculating(false);
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
      // setIsCalculating(false);
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
      if (currentAchievedPoints >= target) {
        break;
      }

      const refPointsPerElixir = elixir.refPoints;
      const availableQuantity = elixir.quantity;

      const pointsNeededToMeetTarget = target - currentAchievedPoints;

      let numToTake = 0;
      if (pointsNeededToMeetTarget > 0) {
        numToTake = Math.ceil(pointsNeededToMeetTarget / refPointsPerElixir);
      } else {
        numToTake = 0;
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
    } else {
      setMessage(`Could not reach target. Achieved ${currentAchievedPoints.toLocaleString()} points. Max possible with selected types: ${currentTotalSelectedInventoryRefPoints.toLocaleString()}.`);
    }
    // setIsCalculating(false);
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
        <Calculator size={24} className="text-indigo-600 dark:text-indigo-400" /> Ref Target Calculator
      </h2>

      <div className="mb-4">
        <label htmlFor="targetPoints" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Target Ref Points
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
          Enter the ref points you wish to achieve.
        </p>
      </div>

      <div className="mb-6">
        <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Include Elixir Types:
        </p>
        <div className="flex flex-wrap gap-x-2 gap-y-2">
          {ELIXIR_TYPES_CONFIG.map(typeConfig => {
            const isSelected = selectedElixirTypes.has(typeConfig.name);
            return (
              <button
                key={typeConfig.name}
                type="button"
                onClick={() => handleTypeSelectionChange(typeConfig.name)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all duration-150 ease-in-out
                  ${isSelected
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
                `}
                aria-pressed={isSelected}
              >
                <span className={`w-3 h-3 rounded-full ${typeConfig.color}`}></span>
                <span className="text-sm font-medium">{typeConfig.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* <button
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
      </button> */}

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
                        <span className="flex items-center gap-1"> {/* Added a wrapper span for flex */}
                          <span className={`w-2 h-2 rounded-full ${tier.colorClass}`}></span> {/* Color dot */}
                          <span>{tier.name}:</span>
                        </span>
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
      setError('Please enter valid numbers for points and rate.');
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

const ElixirAbsorbStats = React.memo(({ inventory, elixirTypesConfig, elixirTiersConfig }) => {
  const absorbedStats = useMemo(() => {
    const stats = {};
    elixirTypesConfig.forEach(typeConfig => {
      let totalStat = 0;
      const typeInventory = inventory[typeConfig.name] || {};

      elixirTiersConfig.forEach(tier => {
        const quantity = typeInventory[tier.name] ?? 0;
        const statPerElixir = ELIXIR_ABSORB_STATS_CONFIG[typeConfig.name]?.[tier.name];

        if (quantity > 0 && statPerElixir !== undefined) {
          totalStat += quantity * statPerElixir;
        }
      });
      stats[typeConfig.name] = totalStat;
    });
    return stats;
  }, [inventory, elixirTypesConfig, elixirTiersConfig]);

  // Helper to format stats (e.g., add K for thousands, % for percentages)
  const formatStat = useCallback((type, value) => {
    if (type === 'CD' || type === 'TD' || type === 'SD') {
      return `${(value).toFixed(3)}%`; // Format as percentage with 3 decimal places
    } else if (type === 'HP') {
      if (value >= 1000000) { // Check for millions first
        return `${(value / 1000000).toLocaleString(undefined, { maximumFractionDigits: 1 })}M`; // Format HP as M
      } else if (value >= 1000) { // Then check for thousands
        return `${(value / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}K`; // Format HP as K
      }
      return value.toLocaleString(); // For values less than 1K
    } else if (type === 'ATK') {
      if (value >= 1000000) { // Check for millions first
        return `${(value / 1000000).toLocaleString(undefined, { maximumFractionDigits: 1 })}M`; // Format ATK as M
      } else if (value >= 1000) { // Then check for thousands
        return `${(value / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}K`; // Format ATK as K
      }
      return value.toLocaleString(); // For values less than 1K
    }
    return value.toLocaleString();
  }, []);
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Elixir Absorb Stats</h2>
      <div className="flex flex-col gap-3">
        {elixirTypesConfig.map(typeConfig => (
          <div
            key={typeConfig.name}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 shadow-sm"
          >
            {/* Left side: Elixir Type Name with Color */}
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${typeConfig.color}`}></span>
              <span className="font-semibold text-gray-800 dark:text-gray-200 text-base">{typeConfig.name}</span>
            </div>
            {/* Right side: Absorbed Stat Value */}
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              {formatStat(typeConfig.name, absorbedStats[typeConfig.name] || 0)}
            </p>
          </div>
        ))}
      </div>
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

  // Handler for clearing all elixirs
  const handleClearAllElixirs = useCallback(() => {
    setInventory(() => {
      const emptyInventory = {};
      ELIXIR_TYPES_CONFIG.forEach(typeConfig => {
        emptyInventory[typeConfig.name] = {};
        ELIXIR_TIERS_CONFIG.forEach(tier => {
          emptyInventory[typeConfig.name][tier.name] = 0; // Set all to 0
        });
      });
      return emptyInventory;
    });
  }, []);


  // Handler for clearing all elixirs of a specific type
  const handleClearTypeInventory = useCallback((elixirTypeToClear) => {
    setInventory(prevInventory => {
      const newTypeInventory = {};
      ELIXIR_TIERS_CONFIG.forEach(tier => {
        newTypeInventory[tier.name] = 0; // Set all tiers for this type to 0
      });
      return {
        ...prevInventory,
        [elixirTypeToClear]: newTypeInventory,
      };
    });
  }, []);

  return (
    <div className="min-h-screen b dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 font-sans">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-700 dark:text-indigo-300 mb-2 leading-tight">
          Elixir Inventory Tracker
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Manage your elixirs by type, track points, and optimize usage for targets.
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Created by iFrag.
        </p>
      </header>

      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Inventory Management */}
        <section>
          <ElixirInventory
            inventory={inventory}
            onInventoryChange={handleInventoryChange}
            totalRefPointsPerType={totalRefPointsPerType}
            onClearTypeInventory={handleClearTypeInventory}
            onClearAllElixirs={handleClearAllElixirs}
          />
        </section>

        {/* Right Column - Summary, Optimal Selection, and New Elixir Point Calculator */}
        <section className="flex flex-col gap-6">
          <TotalSummaryDisplay
            totalOverallRefPoints={totalOverallRefPoints}
            totalRefPointsPerType={totalRefPointsPerType}
          />
          <ElixirAbsorbStats
            inventory={inventory}
            elixirTypesConfig={ELIXIR_TYPES_CONFIG}
            elixirTiersConfig={ELIXIR_TIERS_CONFIG}
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
        Created by iFrag2142.
      </footer>
    </div>
  );
};

export default ElixirTrackerApp;

