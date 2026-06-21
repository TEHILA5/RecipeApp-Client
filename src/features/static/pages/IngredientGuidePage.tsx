import { StaticPage } from './StaticPageHelpers';
import './IngredientGuidePage.css';
import pageIcon      from '../../../assets/icons/page-ingredient-guide.png';
import flourIcon     from '../../../assets/icons/ing-flour.png';
import butterIcon    from '../../../assets/icons/ing-butter.png';
import eggIcon       from '../../../assets/icons/ing-egg.png';
import sugarIcon     from '../../../assets/icons/ing-sugar.png';
import bakingPowIcon from '../../../assets/icons/ing-baking-powder.png';
import vanillaIcon   from '../../../assets/icons/ing-vanilla.png';
import creamIcon     from '../../../assets/icons/ing-cream.png';
import chocolateIcon from '../../../assets/icons/ing-chocolate.png';

const ingredients = [
  { icon: flourIcon,     name: 'All-Purpose Flour',     tip: 'The backbone of most baked goods. Sift before measuring for lighter results.' },
  { icon: butterIcon,    name: 'Butter',                tip: 'Use unsalted butter so you can control the salt level. Softened = creaming; melted = fudgy texture.' },
  { icon: eggIcon,       name: 'Eggs',                  tip: "Eggs provide structure, richness, and lift. Size matters — use large eggs unless specified." },
  { icon: sugarIcon,     name: 'Sugar',                 tip: "White sugar = crisp; brown sugar = chewy and moist (due to molasses). Don't substitute freely." },
  { icon: bakingPowIcon, name: 'Baking Powder vs Soda', tip: 'Baking soda needs an acid (lemon, buttermilk). Baking powder has its own acid built in.' },
  { icon: vanillaIcon,   name: 'Vanilla Extract',       tip: 'Always use pure vanilla extract, not imitation. It makes a noticeable difference.' },
  { icon: creamIcon,     name: 'Heavy Cream',           tip: 'For whipping, use cream with at least 35% fat. Chill the bowl and beaters for best results.' },
  { icon: chocolateIcon, name: 'Chocolate',             tip: "The higher the cacao percentage, the less sweet and more intense the flavor. Match to your recipe." },
];

export default function IngredientGuidePage() {
  return (
    <StaticPage icon={pageIcon} title="Ingredient Guide" subtitle="Understanding what goes into your desserts">
      <div className="ingredient-list">
        {ingredients.map((ing, i) => (
          <article key={i} className="ingredient-card">
            <img src={ing.icon} alt={ing.name} className="ingredient-card__icon" />
            <div>
              <h3 className="ingredient-card__name">{ing.name}</h3>
              <p className="ingredient-card__tip">{ing.tip}</p>
            </div>
          </article>
        ))}
      </div>
    </StaticPage>
  );
}