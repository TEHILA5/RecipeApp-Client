// ===============================================
// MyRecipesPage - ספר המתכונים האישי
// ===============================================
import { useState } from 'react';
import { useAppSelector } from '../../../redux/hooks';
import MyFavorites from '../components/MyFavorites';
import myBook from '../../../assets/images/my-book.jpg';

type Tab = 'saved';

export default function MyRecipesPage() {
  const [activeTab] = useState<Tab>('saved');
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fdf2f8',
      paddingTop: 'var(--nav-height, 70px)',
      fontFamily: "'Nunito', sans-serif",
    }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(232,121,154,0.08), rgba(232,196,154,0.08))',
        padding: '48px 64px 0',
        borderBottom: '2px solid rgba(232,121,154,0.1)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}>
            <img src={myBook} alt="Recipe Book" style={{
              width: 110, height: 'auto', borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(212,84,122,0.2)',
              transform: 'rotate(-3deg)',
            }} />
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#d4547a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                ✦ My Collection
              </div>
              <h1 style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                color: '#1f2937', marginBottom: '6px', lineHeight: 1.1,
              }}>
                {user?.name ? `${user.name}'s` : 'My'} <span style={{ color: '#d4547a' }}>Recipe Book</span>
              </h1>
              <p style={{ color: '#9ca3af', fontSize: '0.95rem', fontWeight: 500, marginBottom: '28px' }}>
                Your saved dessert recipes, all in one place
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px' }}>
            <div style={{
              padding: '12px 28px',
              borderRadius: '12px 12px 0 0',
              background: 'white',
              color: '#d4547a',
              fontWeight: 700, fontSize: '0.9rem',
              borderBottom: '2px solid white',
              marginBottom: '-2px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              🔖 Saved Recipes
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        {activeTab === 'saved' && <MyFavorites />}
      </div>
    </div>
  );
}
