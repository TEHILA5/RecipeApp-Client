import type { ReactNode } from 'react';

interface SectionHeaderProps {
  eyebrow: string;
  title: ReactNode;
}

export default function SectionHeader({ eyebrow, title }: SectionHeaderProps) {
  return (
    <header className="section-header">
      <div className="section-eyebrow">{eyebrow}</div>
      <h2 className="section-title">{title}</h2>
      <div className="section-divider" />
    </header>
  );
}
