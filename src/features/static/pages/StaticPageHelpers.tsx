import React from 'react';
import './StaticPageHelpers.css';

export function StaticPage({ icon, title, subtitle, children, className }: {
  icon: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={['static-page', className].filter(Boolean).join(' ')}>
      <header className="static-page__header">
        <div className="static-page__icon-wrap">
          <img src={icon} alt={title} className="static-page__icon" />
        </div>
        <h1 className="static-page__title">{title}</h1>
        <p className="static-page__subtitle">{subtitle}</p>
      </header>
      <div className="static-page__body">
        {children}
      </div>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="static-section">
      <h2 className="static-section__title">{title}</h2>
      <p className="static-section__body">{children}</p>
    </section>
  );
}