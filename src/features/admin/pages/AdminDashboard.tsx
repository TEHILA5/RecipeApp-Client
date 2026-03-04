// ===============================================
// AdminDashboard - Sweet&Treat
// ===============================================
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../redux/hooks';

interface DashboardCard {
  title: string;
  description: string;
  icon: string;
  link: string;
  color: string;
}

const CARDS: DashboardCard[] = [
  {
    title: 'Add New Recipe',
    description: 'Create a new dessert recipe with ingredients and instructions',
    icon: '🍰',
    link: '/recipes/create',
    color: 'linear-gradient(135deg, #e8799a, #d4547a)',
  },
  {
    title: 'Manage Ingredients',
    description: 'Add new ingredients or edit existing ones',
    icon: '🧂',
    link: '/admin/ingredients',
    color: 'linear-gradient(135deg, #f59e0b, #d97706)',
  },
  {
    title: 'Browse Recipes',
    description: 'View, edit or delete existing recipes',
    icon: '📋',
    link: '/recipes',
    color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  },
  {
    title: 'Sweetie Chat',
    description: 'Test the AI dessert assistant',
    icon: '🤖',
    link: '/chat',
    color: 'linear-gradient(135deg, #ec4899, #be185d)',
  },
];

export default function AdminDashboard() {
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
        background: 'linear-gradient(135deg, rgba(232,121,154,0.1), rgba(212,84,122,0.05))',
        padding: '48px 64px 40px',
        borderBottom: '2px solid rgba(232,121,154,0.12)',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#d4547a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
            ✦ Admin Panel
          </div>
          <h1 style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            color: '#1f2937', marginBottom: '8px', lineHeight: 1.1,
          }}>
            Welcome back, <span style={{ color: '#d4547a' }}>{user?.name || 'Admin'}</span> 👋
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem', fontWeight: 500 }}>
            Manage your Sweet&Treat recipe app from here
          </p>
        </div>
      </div>

      {/* Cards */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '40px 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px',
      }}>
        {CARDS.map((card) => (
          <Link
            key={card.link}
            to={card.link}
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              background: 'white',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(212,84,122,0.08)',
              transition: 'all 0.25s',
              cursor: 'pointer',
            }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px rgba(212,84,122,0.18)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'none';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(212,84,122,0.08)';
              }}
            >
              {/* Color bar */}
              <div style={{
                height: '6px',
                background: card.color,
              }} />

              <div style={{ padding: '28px 28px 32px' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '16px',
                  background: card.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.8rem', marginBottom: '18px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                }}>
                  {card.icon}
                </div>

                <h3 style={{
                  fontFamily: "'Dancing Script', cursive",
                  fontSize: '1.4rem', color: '#1f2937',
                  marginBottom: '8px', lineHeight: 1.2,
                }}>
                  {card.title}
                </h3>
                <p style={{
                  fontSize: '0.85rem', color: '#6b7280',
                  lineHeight: 1.6, marginBottom: '20px',
                }}>
                  {card.description}
                </p>

                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '8px 18px', borderRadius: '999px',
                  background: 'rgba(212,84,122,0.08)',
                  color: '#d4547a', fontWeight: 700, fontSize: '0.82rem',
                }}>
                  Go →
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
