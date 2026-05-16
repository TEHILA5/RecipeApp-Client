import { useState, useRef } from 'react';
import { useClickOutside } from '../../../shared/hooks/useClickOutside';
import type { RecipeCategory, DifficultyLevel } from '../types/recipe.types';
import { CATEGORY_IMAGES } from '../types/recipe.types';
import './RecipeFilters.css';

import filtersIcon  from '../../../assets/icons/filters-icon.png';
import levelEasy    from '../../../assets/icons/meta-level-easy.png';
import levelMedium  from '../../../assets/icons/meta-level-medium.png';
import levelHard    from '../../../assets/icons/meta-level-hard.png';

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

const POPULAR_CATEGORIES: { value: RecipeCategory; label: string }[] = [
  { value: 'Cakes',       label: 'Cakes'       },
  { value: 'Cookies',     label: 'Cookies'     },
  { value: 'Cupcakes',    label: 'Cupcakes'    },
  { value: 'Brownies',    label: 'Brownies'    },
  { value: 'Cheesecakes', label: 'Cheesecakes' },
  { value: 'IceCream',    label: 'Ice Cream'   },
  { value: 'Pies',        label: 'Pies'        },
  { value: 'Pastries',    label: 'Pastries'    },
  { value: 'Donuts',      label: 'Donuts'      },
];

const MORE_CATEGORIES: { value: RecipeCategory; label: string }[] = [
  { value: 'Sweats',              label: 'Sweets'            },
  { value: 'BundtCakes',          label: 'Bundt Cakes'       },
  { value: 'Bars',                label: 'Bars'              },
  { value: 'Mousse',              label: 'Mousse'            },
  { value: 'Puddings',            label: 'Puddings'          },
  { value: 'Panna',               label: 'Panna Cotta'       },
  { value: 'Tiramisu',            label: 'Tiramisu'          },
  { value: 'FrozenDesserts',      label: 'Frozen Desserts'   },
  { value: 'Tarts',               label: 'Tarts'             },
  { value: 'Crumbles',            label: 'Crumbles'          },
  { value: 'FruitSalads',         label: 'Fruit Salads'      },
  { value: 'Churros',             label: 'Churros'           },
  { value: 'Crepes',              label: 'Crepes'            },
  { value: 'Waffles',             label: 'Waffles'           },
  { value: 'NoBakeCakes',         label: 'No-Bake Cakes'     },
  { value: 'Truffles',            label: 'Truffles'          },
  { value: 'EnergyBalls',         label: 'Energy Balls'      },
  { value: 'SoufleeAndCustard',   label: 'Souflee & Custard' },
  { value: 'MilkDesserts',        label: 'Milk Desserts'     },
  { value: 'JellyAndGelatin',     label: 'Jelly & Gelatin'   },
  { value: 'TraditionalDesserts', label: 'Traditional'       },
];

const LEVELS: { value: DifficultyLevel; label: string; icon: string }[] = [
  { value: 1, label: 'Easy',   icon: levelEasy   },
  { value: 2, label: 'Medium', icon: levelMedium },
  { value: 3, label: 'Hard',   icon: levelHard   },
];

const TIME_OPTIONS = [
  { value: 30,  label: 'Under 30 min'  },
  { value: 60,  label: 'Under 1 hour'  },
  { value: 120, label: 'Under 2 hours' },
];

function CategoryChip({ value, label, active, onClick }: {
  value: RecipeCategory; label: string; active: boolean; onClick: () => void;
}) {
  const img = CATEGORY_IMAGES[value];
  return (
    <button onClick={onClick} className={`filter-chip ${active ? 'active' : ''}`}>
      {img
        ? <img src={img} alt={label} className="category-chip-img" />
        : label
      }
    </button>
  );
}

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
        <img src={filtersIcon} alt="Filters" className="filters-toggle-icon" />
        <span>Filters</span>
        {activeCount > 0 && <span className="filter-count">{activeCount}</span>}
        <span className={`toggle-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </button>

      <div className={`filters-content ${isExpanded ? 'expanded' : ''}`}>
        <div className="filter-group" ref={panelRef}>
          <h4 className="filter-title">Category</h4>
          <div className="filter-options">
            {POPULAR_CATEGORIES.map(({ value, label }) => (
              <CategoryChip key={value} value={value} label={label} active={filters.category === value} onClick={() => setCategory(value)} />
            ))}

            {showMoreCategories && MORE_CATEGORIES.map(({ value, label }) => (
              <CategoryChip key={value} value={value} label={label} active={filters.category === value} onClick={() => setCategory(value)} />
            ))}

            <button className="filter-chip dashed" onClick={() => setShowMore((v) => !v)}>
              {showMoreCategories ? '▲ Less' : `▼ +${MORE_CATEGORIES.length} more`}
            </button>
          </div>
        </div>

        <div className="filter-group">
          <h4 className="filter-title">Difficulty</h4>
          <div className="filter-options">
            {LEVELS.map(({ value, label, icon }) => (
              <button
                key={value}
                onClick={() => setLevel(value)}
                className={`filter-chip ${filters.level === value ? 'active' : ''}`}
              >
                <img src={icon} alt={label} className="level-chip-icon" />
                {label}
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