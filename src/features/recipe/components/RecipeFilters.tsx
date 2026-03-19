import { useState, useRef } from 'react';
import { useClickOutside } from '../../../shared/hooks/useClickOutside';
import type { RecipeCategory, DifficultyLevel } from '../types/recipe.types';

interface Filters {
  category: RecipeCategory | null;
  level: DifficultyLevel | null;
  maxTime: number | null;
}

interface RecipeFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  onClear: () => void;
}

const POPULAR_CATEGORIES: { value: RecipeCategory; label: string; emoji: string }[] = [
  { value: 'Cakes',       label: 'Cakes',       emoji: '🎂' },
  { value: 'Cookies',     label: 'Cookies',     emoji: '🍪' },
  { value: 'Cupcakes',    label: 'Cupcakes',    emoji: '🧁' },
  { value: 'Brownies',    label: 'Brownies',    emoji: '🟫' },
  { value: 'Cheesecakes', label: 'Cheesecakes', emoji: '🍰' },
  { value: 'IceCream',    label: 'Ice Cream',   emoji: '🍦' },
  { value: 'Pies',        label: 'Pies',        emoji: '🥧' },
  { value: 'Pastries',    label: 'Pastries',    emoji: '🥐' },
  { value: 'Donuts',      label: 'Donuts',      emoji: '🍩' },
];

const MORE_CATEGORIES: { value: RecipeCategory; label: string; emoji: string }[] = [
  { value: 'Sweats',              label: 'Sweets',            emoji: '🍬' },
  { value: 'BundtCakes',          label: 'Bundt Cakes',       emoji: '🎂' },
  { value: 'Bars',                label: 'Bars',              emoji: '🍫' },
  { value: 'Mousse',              label: 'Mousse',            emoji: '🍮' },
  { value: 'Puddings',            label: 'Puddings',          emoji: '🍮' },
  { value: 'Panna',               label: 'Panna Cotta',       emoji: '🍶' },
  { value: 'Tiramisu',            label: 'Tiramisu',          emoji: '☕' },
  { value: 'FrozenDesserts',      label: 'Frozen Desserts',   emoji: '🧊' },
  { value: 'Tarts',               label: 'Tarts',             emoji: '🥧' },
  { value: 'Crumbles',            label: 'Crumbles',          emoji: '🫐' },
  { value: 'FruitSalads',         label: 'Fruit Salads',      emoji: '🍓' },
  { value: 'Churros',             label: 'Churros',           emoji: '🌀' },
  { value: 'Crepes',              label: 'Crepes',            emoji: '🥞' },
  { value: 'Waffles',             label: 'Waffles',           emoji: '🧇' },
  { value: 'NoBakeCakes',         label: 'No-Bake Cakes',     emoji: '❄️' },
  { value: 'Truffles',            label: 'Truffles',          emoji: '🍫' },
  { value: 'EnergyBalls',         label: 'Energy Balls',      emoji: '⚡' },
  { value: 'SoufleeAndCustard',   label: 'Souflee & Custard', emoji: '🥚' },
  { value: 'MilkDesserts',        label: 'Milk Desserts',     emoji: '🥛' },
  { value: 'JellyAndGelatin',     label: 'Jelly & Gelatin',   emoji: '🟣' },
  { value: 'TraditionalDesserts', label: 'Traditional',       emoji: '🏺' },
];

const LEVELS: { value: DifficultyLevel; label: string; emoji: string }[] = [
  { value: 1, label: 'Easy',   emoji: '🟢' },
  { value: 2, label: 'Medium', emoji: '🟡' },
  { value: 3, label: 'Hard',   emoji: '🔴' },
];

const TIME_OPTIONS = [
  { value: 30,  label: 'Under 30 min' },
  { value: 60,  label: 'Under 1 hour' },
  { value: 120, label: 'Under 2 hours' },
];

export default function RecipeFilters({ filters, onFilterChange, onClear }: RecipeFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useClickOutside(panelRef, () => setShowMore(false), showMore);

  const setCategory = (category: RecipeCategory) =>
    onFilterChange({ ...filters, category: filters.category === category ? null : category });

  const setLevel = (level: DifficultyLevel) =>
    onFilterChange({ ...filters, level: filters.level === level ? null : level });

  const setTime = (maxTime: number) =>
    onFilterChange({ ...filters, maxTime: filters.maxTime === maxTime ? null : maxTime });

  const activeCount = [filters.category, filters.level, filters.maxTime].filter(Boolean).length;
  const selectedInMore = filters.category
    ? MORE_CATEGORIES.some((c) => c.value === filters.category)
    : false;
  const showMoreCategories = showMore || selectedInMore;

  return (
    <div className="recipe-filters">
      <button className="filters-toggle" onClick={() => setIsExpanded(!isExpanded)}>
        <span>🎯 Filters</span>
        {activeCount > 0 && <span className="filter-count">{activeCount}</span>}
        <span className={`toggle-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </button>

      <div className={`filters-content ${isExpanded ? 'expanded' : ''}`}>
        <div className="filter-group" ref={panelRef}>
          <h4 className="filter-title">Category</h4>
          <div className="filter-options">
            {POPULAR_CATEGORIES.map(({ value, label, emoji }) => (
              <button
                key={value}
                onClick={() => setCategory(value)}
                className={`filter-chip ${filters.category === value ? 'active' : ''}`}
              >
                <span>{emoji}</span> {label}
              </button>
            ))}

            {showMoreCategories && MORE_CATEGORIES.map(({ value, label, emoji }) => (
              <button
                key={value}
                onClick={() => setCategory(value)}
                className={`filter-chip ${filters.category === value ? 'active' : ''}`}
              >
                <span>{emoji}</span> {label}
              </button>
            ))}

            <button className="filter-chip dashed" onClick={() => setShowMore((v) => !v)}>
              {showMoreCategories ? '▲ Less' : `▼ +${MORE_CATEGORIES.length} more`}
            </button>
          </div>
        </div>

        <div className="filter-group">
          <h4 className="filter-title">Difficulty</h4>
          <div className="filter-options">
            {LEVELS.map(({ value, label, emoji }) => (
              <button
                key={value}
                onClick={() => setLevel(value)}
                className={`filter-chip ${filters.level === value ? 'active' : ''}`}
              >
                <span>{emoji}</span> {label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h4 className="filter-title">Preparation Time</h4>
          <div className="filter-options">
            {TIME_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setTime(value)}
                className={`filter-chip ${filters.maxTime === value ? 'active' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {activeCount > 0 && (
          <button onClick={onClear} className="clear-filters-btn">
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
}
