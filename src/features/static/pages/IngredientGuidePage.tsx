import { StaticPage } from './StaticPageHelpers';

const ingredients = [
  { name: 'All-Purpose Flour', emoji: '🌾', tip: 'The backbone of most baked goods. Sift before measuring for lighter results.' },
  { name: 'Butter', emoji: '🧈', tip: 'Use unsalted butter so you can control the salt level. Softened = creaming; melted = fudgy texture.' },
  { name: 'Eggs', emoji: '🥚', tip: "Eggs provide structure, richness, and lift. Size matters — use large eggs unless specified." },
  { name: 'Sugar', emoji: '🍬', tip: "White sugar = crisp; brown sugar = chewy and moist (due to molasses). Don't substitute freely." },
  { name: 'Baking Powder vs Soda', emoji: '🫧', tip: 'Baking soda needs an acid (lemon, buttermilk). Baking powder has its own acid built in.' },
  { name: 'Vanilla Extract', emoji: '🌿', tip: 'Always use pure vanilla extract, not imitation. It makes a noticeable difference.' },
  { name: 'Heavy Cream', emoji: '🥛', tip: 'For whipping, use cream with at least 35% fat. Chill the bowl and beaters for best results.' },
  { name: 'Chocolate', emoji: '🍫', tip: "The higher the cacao percentage, the less sweet and more intense the flavor. Match to your recipe." },
];

export default function IngredientGuidePage() {
  return (
    <StaticPage emoji="📖" title="Ingredient Guide" subtitle="Understanding what goes into your desserts">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {ingredients.map((ing, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', background: 'white', borderRadius: '16px', padding: '18px 20px', boxShadow: '0 2px 12px rgba(212,84,122,0.06)', border: '1px solid #fce7f3' }}>
            <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>{ing.emoji}</span>
            <div>
              <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, color: '#d4547a', marginBottom: '4px', fontSize: '0.95rem' }}>{ing.name}</h3>
              <p style={{ color: '#6b7280', lineHeight: 1.5, fontSize: '0.88rem', margin: 0 }}>{ing.tip}</p>
            </div>
          </div>
        ))}
      </div>
    </StaticPage>
  );
}
