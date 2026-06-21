import { Link } from 'react-router-dom';
import { useGetRecipesQuery } from '../../recipe/redux/recipeSlice';
import SectionHeader from '../../../shared/components/UI/SectionHeader';
import './CategoryGrid.css';

const CATEGORIES = [
  {
    name: 'Cakes', 
    cat: 'Cakes',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80',
  },
  {
    name: 'Cookies', 
    cat: 'Cookies',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80',
  },
  {
    name: 'Pies', 
    cat: 'Pies',
    image: 'https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?w=400&q=80',
  },
  {
    name: 'Pastries', 
    cat: 'Pastries',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80',
  },
];

export default function CategoryGrid() {
  const { data: recipes = [] } = useGetRecipesQuery();

  return (
    <section className="section section-bg">
      <SectionHeader eyebrow="✦ Explore By" title={<>Recipe <span>Categories</span></>} />
      <div className="categories-grid">
        {CATEGORIES.map(({ name, cat, image }) => (
          <Link key={cat} to={`/recipes?category=${cat}`} className="cat-card">
            <img src={image} alt={name} className="cat-bg" />
            <div className="cat-overlay">
              <div className="cat-name">{name} </div>
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
