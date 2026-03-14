// ===============================================
// ManageRecipes - דף ניהול מתכונים
// ===============================================
import RecipeModeration from '../components/RecipeModeration';

export default function ManageRecipes() {
  return (
    <div style={{ minHeight: '100vh', background: '#fdf2f8', paddingTop: 'var(--nav-height, 70px)', fontFamily: "'Nunito',sans-serif" }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '2rem', color: '#d4547a', marginBottom: '24px' }}>
          Manage Recipes 🍰
        </h1>
        <RecipeModeration />
      </div>
    </div>
  );
}
