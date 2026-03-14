// ===============================================
// ManageIngredients - דף ניהול מרכיבים
// ===============================================
import { Link } from 'react-router-dom';

export default function ManageIngredients() {
  return (
    <div style={{ minHeight: '100vh', background: '#fdf2f8', paddingTop: 'var(--nav-height, 70px)', fontFamily: "'Nunito',sans-serif" }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '2rem', color: '#d4547a', marginBottom: '24px' }}>
          Manage Ingredients 🧂
        </h1>
        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(212,84,122,0.07)' }}>
          <p style={{ color: '#9ca3af', marginBottom: '24px' }}>Add, edit, or remove ingredients from the system.</p>
          <Link to="/admin/ingredients" style={{ display: 'inline-block', padding: '12px 28px', borderRadius: '999px', textDecoration: 'none', background: 'linear-gradient(135deg, #e8799a, #d4547a)', color: 'white', fontFamily: "'Nunito',sans-serif", fontWeight: 700, boxShadow: '0 4px 12px rgba(212,84,122,0.3)' }}>
            🧂 Go to Ingredients Manager
          </Link>
        </div>
      </div>
    </div>
  );
}
