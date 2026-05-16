import { useState } from 'react';
import { CATEGORY_IMAGES, type RecipeCategory } from '../../recipe/types/recipe.types';
import './AnalyticsTab.css';

export interface WeeklyCategoryStats {
  week: string;
  weekLabel: string;
  categoryName: string;
  viewCount: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Cakes: '#d4547a', Cookies: '#f59e0b', IceCream: '#3b82f6',
  Brownies: '#92400e', Cupcakes: '#ec4899', Cheesecakes: '#8b5cf6',
  Pies: '#10b981', Tarts: '#06b6d4', Donuts: '#f97316',
  Waffles: '#84cc16', Crepes: '#6366f1', Truffles: '#be123c',
  Pastries: '#0891b2', Mousse: '#7c3aed', Puddings: '#ca8a04',
};

const getColor = (cat: string) => CATEGORY_COLORS[cat] ?? '#9ca3af';

const medals = [
  '/src/assets/icons/rank-gold-medal.png',
  '/src/assets/icons/rank-silver-medal.png',
  '/src/assets/icons/bronze-medal.png',
  '/src/assets/icons/4th-medal.png',
  '/src/assets/icons/5th-medal.png',
];

function CategoryIcon({ name }: { name: string }) {
  const img = CATEGORY_IMAGES[name as RecipeCategory];
  return img
    ? <img src={img} alt={name} className="at-cat-icon-img" />
    : <span>🧁</span>;
}

interface AnalyticsTabProps {
  weeklyStats: WeeklyCategoryStats[];
  loading: boolean;
}

export default function AnalyticsTab({ weeklyStats, loading }: AnalyticsTabProps) {
  const [selectedWeek, setSelectedWeek] = useState<string>('');

  const weeks = [...new Set(weeklyStats.map((s) => s.week))].sort();
  const categories = [...new Set(weeklyStats.map((s) => s.categoryName))];
  const activeWeek = selectedWeek || weeks[weeks.length - 1] || '';
  const weekData = weeklyStats.filter((s) => s.week === activeWeek).sort((a, b) => b.viewCount - a.viewCount);
  const weekLabel = weekData[0]?.weekLabel ?? activeWeek;
  const maxCount = Math.max(...weekData.map((s) => s.viewCount), 1);

  if (loading) {
    return (
      <div className="at-loading">
        <div className="at-spinner" />
        Loading analytics...
      </div>
    );
  }

  if (weeklyStats.length === 0) {
    return (
      <div className="at-empty">
        <div className="at-empty-icon">
          <img src="/src/assets/icons/rank-chart.png" alt="" className="at-empty-chart-img" />
        </div>
        <h3 className="at-empty-title">No data yet</h3>
        <p className="at-empty-text">Category views will appear here once users start browsing recipes.</p>
      </div>
    );
  }

  return (
    <div className="at-wrap">
      <div className="at-header">
        <div>
          <h3 className="at-title">
            <img src="/src/assets/icons/rank-chart.png" alt="" className="at-title-icon" />
            Weekly Category Views
          </h3>
          <p className="at-subtitle">
            Showing <strong>{weekLabel}</strong> — {weekData.reduce((s, d) => s + d.viewCount, 0)} total views
          </p>
        </div>
        <div className="at-weeks">
          {weeks.map((w) => {
            const label = weeklyStats.find((s) => s.week === w)?.weekLabel ?? w;
            return (
              <button
                key={w}
                onClick={() => setSelectedWeek(w)}
                className={`at-week-btn${w === activeWeek ? ' at-week-btn--active' : ''}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="at-chart-wrap">
        <div className="at-chart">
          {weekData.map((item) => {
            const pct = (item.viewCount / maxCount) * 100;
            const color = getColor(item.categoryName);
            return (
              <div key={item.categoryName} className="at-bar-col">
                <span className="at-bar-count">{item.viewCount}</span>
                <div className="at-bar-track">
                  <div
                    className="at-bar"
                    style={{
                      height: `${pct}%`,
                      background: `linear-gradient(to top, ${color}, ${color}99)`,
                      boxShadow: `0 4px 12px ${color}40`,
                    }}
                    title={`${item.categoryName}: ${item.viewCount} views`}
                  />
                </div>
                <div className="at-bar-label">
                  <CategoryIcon name={item.categoryName} />
                  <div className="at-bar-name">{item.categoryName}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="at-top5">
        <h4 className="at-section-title">
          <img src="/src/assets/icons/profile-trophy.png" alt="" className="at-section-title-icon" />
          Top Categories — {weekLabel}
        </h4>
        <div className="at-top5-list">
          {weekData.slice(0, 5).map((item, idx) => {
            const pct = Math.round((item.viewCount / maxCount) * 100);
            const color = getColor(item.categoryName);
            return (
              <div key={item.categoryName} className="at-top5-row">
                <img src={medals[idx]} alt={`#${idx + 1}`} className="at-medal" />
                <CategoryIcon name={item.categoryName} />
                <div className="at-top5-info">
                  <div className="at-top5-meta">
                    <span className="at-top5-name">{item.categoryName}</span>
                    <span className="at-top5-views" style={{ color }}>{item.viewCount} views</span>
                  </div>
                  <div className="at-progress-track">
                    <div
                      className="at-progress-bar"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(to right, ${color}, ${color}99)`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {weeks.length > 1 && (
        <div className="at-trend">
          <h4 className="at-section-title">
            <img src="/src/assets/icons/rank-chart.png" alt="" className="at-section-title-icon at-section-title-icon--sm" />
            Trend Overview — All Weeks
          </h4>
          <div className="at-trend-wrap">
            <table className="at-trend-table">
              <thead>
                <tr className="at-trend-thead">
                  <th className="at-trend-th at-trend-th--cat">Category</th>
                  {weeks.map((w) => {
                    const lbl = weeklyStats.find((s) => s.week === w)?.weekLabel ?? w;
                    return <th key={w} className="at-trend-th">{lbl}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, idx) => (
                  <tr key={cat} className={`at-trend-row${idx % 2 !== 0 ? ' at-trend-row--odd' : ''}`}>
                    <td className="at-trend-cat">
                      <CategoryIcon name={cat} />
                      <span style={{ color: getColor(cat) }}>{cat}</span>
                    </td>
                    {weeks.map((w) => {
                      const val = weeklyStats.find((s) => s.week === w && s.categoryName === cat)?.viewCount ?? 0;
                      return (
                        <td
                          key={w}
                          className="at-trend-val"
                          style={{
                            fontWeight: val > 0 ? 700 : 400,
                            color: val > 0 ? getColor(cat) : '#d1d5db',
                          }}
                        >
                          {val > 0 ? val : '—'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}