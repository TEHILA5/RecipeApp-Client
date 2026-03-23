// ===============================================
// StaticPageHelpers.tsx
// רכיבים משותפים לכל הדפים הסטטיים
// ===============================================

export function StaticPage({ emoji, title, subtitle, children }: {
  emoji: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: '100vh', background: '#fdf2f8', paddingTop: 'var(--nav-height, 70px)', fontFamily: "'Nunito', sans-serif" }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, rgba(232,121,154,0.08), rgba(232,196,154,0.08))', padding: '56px 24px 44px', borderBottom: '2px solid rgba(232,121,154,0.1)', textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>{emoji}</div>
        <h1 style={{ fontFamily: "'Dancing Script',cursive", fontSize: 'clamp(2.2rem, 4vw, 3rem)', color: '#1f2937', marginBottom: '8px' }}>
          {title}
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '1rem', fontWeight: 500 }}>{subtitle}</p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '48px 24px' }}>
        {children}
      </div>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h2 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.6rem', color: '#d4547a', marginBottom: '12px' }}>{title}</h2>
      <p style={{ color: '#4b5563', lineHeight: 1.8, fontSize: '0.95rem' }}>{children}</p>
    </div>
  );
}

export const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#6b7280', marginBottom: '6px',
};

export const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '2px solid #fce7f3', borderRadius: '12px',
  fontFamily: "'Nunito',sans-serif", fontSize: '0.9rem', outline: 'none',
  boxSizing: 'border-box', background: 'white', color: '#374151',
};
