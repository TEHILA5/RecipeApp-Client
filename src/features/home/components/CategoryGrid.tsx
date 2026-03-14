// ===============================================
// CategoryGrid - קטגוריות לגלישה
// ===============================================
import { Link } from 'react-router-dom';
import { useGetRecipesQuery } from '../../recipe/redux/recipeSlice';

const CATEGORIES = [
  { name: 'Cakes',     emoji: '🎂', cat: 'Cakes',    color: 'linear-gradient(135deg, #e8799a, #d4547a)' },
  { name: 'Cookies',   emoji: '🍪', cat: 'Cookies',  color: 'linear-gradient(135deg, #c4894a, #e8c49a)' },
  { name: 'Pies',      emoji: '🥧', cat: 'Pies',     color: 'linear-gradient(135deg, #f9e4ec, #e8c49a)' },
  { name: 'Pastries',  emoji: '🥐', cat: 'Pastries', color: 'linear-gradient(135deg, #9e6b7e, #d4a8b8)' },
];

export default function CategoryGrid() {
  const { data: recipes = [] } = useGetRecipesQuery();

  return (
    <section className="section section-bg">
      <div className="section-header">
        <div className="section-eyebrow">✦ Explore By</div>
        <h2 className="section-title">Recipe <span>Categories</span></h2>
        <div className="section-divider"></div>
      </div>
      <div className="categories-grid">
        {CATEGORIES.map(({ name, emoji, cat, color }) => (
          <Link key={cat} to={`/recipes?category=${cat}`} className="cat-card">
            <div style={{
              width: '100%', height: '100%', background: color,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '120px',
            }}>
              {emoji}
            </div>
            <div className="cat-overlay">
              <div className="cat-name">{name} {emoji}</div>
              <div className="cat-count">
                {recipes.filter((r) => r.category === cat).length || '—'} Recipes
              </div>
              <div className="cat-arrow">→</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
