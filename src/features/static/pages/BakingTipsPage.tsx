import { StaticPage } from './StaticPageHelpers';
import pageIcon        from '../../../assets/icons/page-baking-tips.png';
import temperatureIcon from '../../../assets/icons/tip-temperature.png';
import scaleIcon       from '../../../assets/icons/tip-scale.png';
import noOvermixIcon   from '../../../assets/icons/tip-no-overmix.png';
import ovenIcon        from '../../../assets/icons/tip-oven.png';
import chillIcon       from '../../../assets/icons/tip-chill.png';
import saltIcon        from '../../../assets/icons/tip-salt.png';
import './BakingTipsPage.css';

const tips = [
  { icon: temperatureIcon, title: 'Room Temperature Matters', body: "Always bring butter, eggs, and dairy to room temperature before baking. Cold ingredients don't blend as smoothly and can affect texture." },
  { icon: scaleIcon,       title: 'Measure by Weight',        body: 'Baking is chemistry. Use a kitchen scale for flour, sugar, and butter — volume measurements can vary wildly.' },
  { icon: noOvermixIcon,   title: "Don't Overmix",            body: 'Once you add flour, mix only until just combined. Overmixing develops gluten and leads to tough, dense baked goods.' },
  { icon: ovenIcon,        title: 'Oven Temperature',         body: "Every oven is different. Use an oven thermometer to verify your actual temperature, and always preheat for at least 15 minutes." },
  { icon: chillIcon,       title: 'Chill Your Dough',         body: "For cookies and pastry, chilling the dough before baking helps it hold its shape and develops better flavor." },
  { icon: saltIcon,        title: 'Salt is Your Friend',      body: 'A pinch of salt in desserts balances sweetness and enhances all other flavors. Never skip it.' },
];

export default function BakingTipsPage() {
  return (
    <StaticPage icon={pageIcon} title="Baking Tips" subtitle="Pro secrets for better desserts">
      <div className="tips-grid">
        {tips.map((tip, i) => (
          <div key={i} className="tip-card">
            <img src={tip.icon} alt={tip.title} className="tip-icon" />
            <h3 className="tip-title">{tip.title}</h3>
            <p className="tip-body">{tip.body}</p>
          </div>
        ))}
      </div>
    </StaticPage>
  );
}