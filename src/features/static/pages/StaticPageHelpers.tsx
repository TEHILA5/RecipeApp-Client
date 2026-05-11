import React from 'react';

export function StaticPage({ icon, title, subtitle, children }: {
  icon: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: '100vh', background: '#fdf2f8', paddingTop: 'var(--nav-height, 70px)', fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ background: 'linear-gradient(135deg, rgba(232,121,154,0.08), rgba(232,196,154,0.08))', padding: '56px 24px 44px', borderBottom: '2px solid rgba(232,121,154,0.1)', textAlign: 'center' }}>
        <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
          <img src={icon} alt={title} style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
        </div>
        <h1 style={{ fontFamily: "'Dancing Script',cursive", fontSize: 'clamp(2.2rem, 4vw, 3rem)', color: '#1f2937', marginBottom: '8px' }}>
          {title}
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '1rem', fontWeight: 500 }}>{subtitle}</p>
      </div>
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
