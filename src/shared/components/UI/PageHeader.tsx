import type { ReactNode } from 'react';
import './PageHeader.css';

export type PageHeaderVariant = 'default' | 'dark' | 'purple' | 'gradient';
export type PageHeaderLayout = 'stacked' | 'split' | 'media-row' | 'inline' | 'custom';
export type PageHeaderSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type PageHeaderPadding = 'default' | 'large' | 'compact' | 'flush' | 'hero';

interface PageHeaderProps {
  eyebrow?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  variant?: PageHeaderVariant;
  align?: 'center' | 'left';
  layout?: PageHeaderLayout;
  size?: PageHeaderSize;
  padding?: PageHeaderPadding;
  action?: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  className?: string;
}

function cx(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(' ');
}

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  variant = 'default',
  align = 'center',
  layout = 'stacked',
  size = 'md',
  padding = 'default',
  action,
  lead,
  children,
  className,
}: PageHeaderProps) {
  const rootClass = cx(
    'page-header-band',
    `page-header-band--${variant}`,
    align === 'center' && 'page-header-band--center',
    align === 'left' && 'page-header-band--left',
    layout !== 'custom' && `page-header-band--layout-${layout}`,
    padding !== 'default' && `page-header-band--pad-${padding}`,
    className,
  );

  const innerClass = cx(
    'page-header-band__inner',
    `page-header-band__inner--${size}`,
    layout === 'split' && 'page-header-band__inner--split',
  );

  if (layout === 'inline') {
    return (
      <header className={rootClass}>
        {lead}
        {(title || subtitle) && (
          <div className="page-header-band__text page-header-band__text--inline">
            {title && <div className="page-header-band__title page-header-band__title--inline">{title}</div>}
            {subtitle && <div className="page-header-band__subtitle page-header-band__subtitle--inline">{subtitle}</div>}
          </div>
        )}
        {action}
        {children}
      </header>
    );
  }

  if (layout === 'custom' || (!eyebrow && !title && !subtitle && !lead && !action)) {
    return (
      <header className={rootClass}>
        <div className={innerClass}>{children}</div>
      </header>
    );
  }

  const textBlock = (
    <>
      {eyebrow && <div className="page-header-band__eyebrow">{eyebrow}</div>}
      {title && <h1 className="page-header-band__title">{title}</h1>}
      {subtitle && <p className="page-header-band__subtitle">{subtitle}</p>}
    </>
  );

  return (
    <header className={rootClass}>
      <div className={innerClass}>
        {layout === 'split' ? (
          <>
            <div className="page-header-band__text">{textBlock}</div>
            {action}
          </>
        ) : layout === 'media-row' ? (
          <>
            <div className="page-header-band__top">
              {lead}
              <div className="page-header-band__text">{textBlock}</div>
            </div>
            {children}
          </>
        ) : (
          <>
            {lead && <div className="page-header-band__lead">{lead}</div>}
            {textBlock}
            {action}
            {children}
          </>
        )}
      </div>
    </header>
  );
}
