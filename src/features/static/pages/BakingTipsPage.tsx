import { StaticPage } from './StaticPageHelpers';

const tips = [
  { emoji: '🌡️', title: 'Room Temperature Matters', body: "Always bring butter, eggs, and dairy to room temperature before baking. Cold ingredients don't blend as smoothly and can affect texture." },
  { emoji: '⚖️', title: 'Measure by Weight', body: 'Baking is chemistry. Use a kitchen scale for flour, sugar, and butter — volume measurements can vary wildly.' },
  { emoji: '🥚', title: "Don't Overmix", body: 'Once you add flour, mix only until just combined. Overmixing develops gluten and leads to tough, dense baked goods.' },
  { emoji: '🔥', title: 'Oven Temperature', body: "Every oven is different. Use an oven thermometer to verify your actual temperature, and always preheat for at least 15 minutes." },
  { emoji: '❄️', title: 'Chill Your Dough', body: "For cookies and pastry, chilling the dough before baking helps it hold its shape and develops better flavor." },
  { emoji: '🧂', title: 'Salt is Your Friend', body: 'A pinch of salt in desserts balances sweetness and enhances all other flavors. Never skip it.' },
];

export default function BakingTipsPage() {
  return (
    <StaticPage emoji="👩‍🍳" title="Baking Tips" subtitle="Pro secrets for better desserts">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {tips.map((tip, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 16px rgba(212,84,122,0.08)', border: '1px solid #fce7f3' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{tip.emoji}</div>
            <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, color: '#1f2937', marginBottom: '8px', fontSize: '1rem' }}>{tip.title}</h3>
            <p style={{ color: '#6b7280', lineHeight: 1.6, fontSize: '0.9rem', margin: 0 }}>{tip.body}</p>
          </div>
        ))}
      </div>
    </StaticPage>
  );
}
