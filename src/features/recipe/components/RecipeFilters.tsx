// ===============================================
// Recipe Filters Component - All Categories
// ===============================================
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

// ✅ קטגוריות פופולריות - מוצגות תמיד
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

// ✅ שאר הקטגוריות - מוצגות רק בלחיצה על "Show All"
const MORE_CATEGORIES: { value: RecipeCategory; label: string; emoji: string }[] = [
  { value: 'Sweats',            label: 'Sweets',          emoji: '🍬' },
  { value: 'BundtCakes',        label: 'Bundt Cakes',     emoji: '🎂' },
  { value: 'Bars',              label: 'Bars',            emoji: '🍫' },
  { value: 'Mousse',            label: 'Mousse',          emoji: '🍮' },
  { value: 'Puddings',          label: 'Puddings',        emoji: '🍮' },
  { value: 'Panna',             label: 'Panna Cotta',     emoji: '🍶' },
  { value: 'Tiramisu',          label: 'Tiramisu',        emoji: '☕' },
  { value: 'FrozenDesserts',    label: 'Frozen Desserts', emoji: '🧊' },
  { value: 'Tarts',             label: 'Tarts',           emoji: '🥧' },
  { value: 'Crumbles',          label: 'Crumbles',        emoji: '🫐' },
  { value: 'FruitSalads',       label: 'Fruit Salads',    emoji: '🍓' },
  { value: 'Churros',           label: 'Churros',         emoji: '🌀' },
  { value: 'Crepes',            label: 'Crepes',          emoji: '🥞' },
  { value: 'Waffles',           label: 'Waffles',         emoji: '🧇' },
  { value: 'NoBakeCakes',       label: 'No-Bake Cakes',   emoji: '❄️' },
  { value: 'Truffles',          label: 'Truffles',        emoji: '🍫' },
  { value: 'EnergyBalls',       label: 'Energy Balls',    emoji: '⚡' },
  { value: 'SoufleeAndCustard', label: 'Souflee & Custard', emoji: '🥚' },
  { value: 'MilkDesserts',      label: 'Milk Desserts',   emoji: '🥛' },
  { value: 'JellyAndGelatin',   label: 'Jelly & Gelatin', emoji: '🟣' },
  { value: 'TraditionalDesserts', label: 'Traditional',   emoji: '🏺' },
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
  const [showAllCategories, setShowAllCategories] = useState(false);

  // ✅ useClickOutside - סגירת פאנל הקטגוריות בלחיצה מחוץ אליו
  const categoriesPanelRef = useRef<HTMLDivElement>(null);
  useClickOutside(
    categoriesPanelRef,
    () => setShowAllCategories(false),
    showAllCategories // פעיל רק כשהפאנל פתוח
  );

  const handleCategoryChange = (category: RecipeCategory) => {
    onFilterChange({ ...filters, category: filters.category === category ? null : category });
  };

  const handleLevelChange = (level: DifficultyLevel) => {
    onFilterChange({ ...filters, level: filters.level === level ? null : level });
  };

  const handleTimeChange = (time: number) => {
    onFilterChange({ ...filters, maxTime: filters.maxTime === time ? null : time });
  };

  const hasActiveFilters = filters.category || filters.level || filters.maxTime;

  // אם הקטגוריה הנבחרת היא מה-"more" list - פתח אוטומטית
  const selectedIsInMore = filters.category
    ? MORE_CATEGORIES.some((c) => c.value === filters.category)
    : false;

  const visibleMoreCategories = showAllCategories || selectedIsInMore;

  const renderChip = (
    value: RecipeCategory,
    label: string,
    emoji: string,
    isActive: boolean
  ) => (
    <button
      key={value}
      onClick={() => handleCategoryChange(value)}
      className={`filter-chip ${isActive ? 'active' : ''}`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
    >
      <span>{emoji}</span>
      {label}
    </button>
  );

  return (
    <div className="recipe-filters">
      {/* Toggle Button (Mobile only) */}
      <button
        className="filters-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>🎯 Filters</span>
        {hasActiveFilters && (
          <span className="filter-count">
            {[filters.category, filters.level, filters.maxTime].filter(Boolean).length}
          </span>
        )}
        <span className={`toggle-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </button>

      {/* Filters Content */}
      <div className={`filters-content ${isExpanded ? 'expanded' : ''}`}>

        {/* ── Category Filter ── */}
        {/* ref מוצמד לכל פאנל הקטגוריות - useClickOutside יסגור בלחיצה מחוץ */}
        <div className="filter-group" ref={categoriesPanelRef}>
          <h4 className="filter-title">Category</h4>
          <div className="filter-options">
            {/* Popular categories - always visible */}
            {POPULAR_CATEGORIES.map(({ value, label, emoji }) =>
              renderChip(value, label, emoji, filters.category === value)
            )}

            {/* More categories - toggle */}
            {visibleMoreCategories &&
              MORE_CATEGORIES.map(({ value, label, emoji }) =>
                renderChip(value, label, emoji, filters.category === value)
              )
            }

            {/* Show more / less button */}
            <button
              onClick={() => setShowAllCategories((v) => !v)}
              className="filter-chip"
              style={{
                borderStyle: 'dashed',
                opacity: 0.75,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {visibleMoreCategories ? '▲ Less' : `▼ +${MORE_CATEGORIES.length} more`}
            </button>
          </div>
        </div>

        {/* ── Level Filter ── */}
        <div className="filter-group">
          <h4 className="filter-title">Difficulty</h4>
          <div className="filter-options">
            {LEVELS.map(({ value, label, emoji }) => (
              <button
                key={value}
                onClick={() => handleLevelChange(value)}
                className={`filter-chip ${filters.level === value ? 'active' : ''}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              >
                <span>{emoji}</span> {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Time Filter ── */}
        <div className="filter-group">
          <h4 className="filter-title">Preparation Time</h4>
          <div className="filter-options">
            {TIME_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handleTimeChange(value)}
                className={`filter-chip ${filters.maxTime === value ? 'active' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Button */}
        {hasActiveFilters && (
          <button onClick={onClear} className="clear-filters-btn">
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
}
