// ===============================================
// ProfilePage - Sweet&Treat
// ===============================================
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { logout } from '../../auth/redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../../../api/userApi';
import type { UserDto } from '../../../api/userApi';
import { getMySavedRecipes, getMyComments } from '../../../api/userActionApi';
import ProfileCard from '../components/ProfileCard';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user: authUser } = useAppSelector((state) => state.auth);

  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedCount, setSavedCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    Promise.all([
      getMe(),
      getMySavedRecipes().catch(() => []),
      getMyComments().catch(() => []),
    ]).then(([userData, saved, comments]) => {
      setUser(userData);
      setSavedCount(saved.length);
      setCommentCount(comments.length);
    }).finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#fdf2f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: 44, height: 44, border: '3px solid #fce7f3',
          borderTopColor: '#d4547a', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) return null;

  const stats = [
    { icon: '🔖', label: 'Saved Recipes', value: savedCount, link: '/my-recipes' },
    { icon: '⭐', label: 'Reviews Written', value: commentCount, link: null },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#fdf2f8', paddingTop: 'var(--nav-height, 70px)', fontFamily: "'Nunito',sans-serif" }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(232,121,154,0.08), rgba(232,196,154,0.05))',
        padding: '48px 64px 40px',
        borderBottom: '2px solid rgba(232,121,154,0.1)',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#d4547a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
            ✦ My Account
          </div>
          <h1 style={{
            fontFamily: "'Dancing Script',cursive",
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            color: '#1f2937', lineHeight: 1.1,
          }}>
            Hello, <span style={{ color: '#d4547a' }}>{authUser?.name || user.name}</span> 👋
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {stats.map((stat) => (
            <div key={stat.label} onClick={() => stat.link && navigate(stat.link)} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white', borderRadius: '20px', padding: '24px',
                boxShadow: '0 4px 20px rgba(212,84,122,0.07)',
                display: 'flex', alignItems: 'center', gap: '16px',
                transition: 'all 0.2s', cursor: stat.link ? 'pointer' : 'default',
              }}
                onMouseEnter={(e) => { if (stat.link) e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(232,121,154,0.12), rgba(212,84,122,0.08))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem',
                }}>
                  {stat.icon}
                </div>
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1f2937', lineHeight: 1 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, marginTop: '2px' }}>
                    {stat.label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Profile card with edit */}
        <ProfileCard user={user} />

        {/* Danger zone */}
        <div style={{
          background: 'white', borderRadius: '24px', padding: '28px',
          boxShadow: '0 4px 24px rgba(212,84,122,0.06)',
          border: '1px solid #fce7f3',
        }}>
          <h3 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.3rem', color: '#1f2937', marginBottom: '16px' }}>
            Account Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Logout */}
            <button onClick={handleLogout} style={{
              width: '100%', padding: '12px', borderRadius: '12px',
              border: '2px solid #e5e7eb', background: 'white', color: '#6b7280',
              fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.9rem',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
              transition: 'all 0.2s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#d4547a'; e.currentTarget.style.color = '#d4547a'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#6b7280'; }}
            >
              🚪 Sign Out
            </button>

            {/* Delete account */}
            {!showDeleteConfirm ? (
              <button onClick={() => setShowDeleteConfirm(true)} style={{
                width: '100%', padding: '12px', borderRadius: '12px',
                border: '2px solid #fee2e2', background: 'white', color: '#ef4444',
                fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.9rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                transition: 'all 0.2s',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#fee2e2'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; }}
              >
                🗑️ Delete Account
              </button>
            ) : (
              <div style={{ padding: '16px', background: '#fee2e2', borderRadius: '12px', border: '1px solid #fecaca' }}>
                <p style={{ color: '#991b1b', fontWeight: 700, marginBottom: '12px', fontSize: '0.9rem' }}>
                  ⚠️ Are you sure? This action cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setShowDeleteConfirm(false)} style={{
                    flex: 1, padding: '10px', borderRadius: '999px',
                    border: '2px solid #e5e7eb', background: 'white', color: '#6b7280',
                    fontFamily: "'Nunito',sans-serif", fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem',
                  }}>
                    Cancel
                  </button>
                  <button onClick={async () => {
                    const { deleteMe } = await import('../../../api/userApi');
                    await deleteMe();
                    dispatch(logout());
                    navigate('/');
                  }} style={{
                    flex: 1, padding: '10px', borderRadius: '999px', border: 'none',
                    background: '#ef4444', color: 'white',
                    fontFamily: "'Nunito',sans-serif", fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem',
                  }}>
                    Yes, Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
