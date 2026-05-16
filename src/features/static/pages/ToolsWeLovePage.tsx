import { StaticPage } from './StaticPageHelpers';
import pageIcon         from '../../../assets/icons/page-tools.png';
import scaleIcon        from '../../../assets/icons/tool-scale.png';
import thermometerIcon  from '../../../assets/icons/tool-thermometer.png';
import mixerIcon        from '../../../assets/icons/tool-stand-mixer.png';
import spatulaIcon      from '../../../assets/icons/tool-offset-spatula.png';
import scraperIcon      from '../../../assets/icons/tool-bench-scraper.png';
import ovenThermIcon    from '../../../assets/icons/tool-oven-thermometer.png';
import springformIcon   from '../../../assets/icons/tool-springform-pan.png';
import doubleboilerIcon from '../../../assets/icons/tool-double-boiler.png';
import tipIcon          from '../../../assets/icons/tool-tip.png';
import './ToolsWeLovePage.css';

const tools = [
  { icon: scaleIcon,        name: 'Digital Kitchen Scale',      why: 'The single most important baking tool. Measuring by weight is more accurate than volume every time.',    tip: 'Look for one with a tare function and 1g precision.',                          category: 'Essential' },
  { icon: thermometerIcon,  name: 'Instant-Read Thermometer',   why: 'Takes the guesswork out of caramel, custard, bread, and chocolate tempering.',                           tip: 'A probe thermometer is worth every penny for perfect results.',                category: 'Essential' },
  { icon: mixerIcon,        name: 'Stand Mixer',                why: 'Creaming butter, whipping cream, kneading dough — a stand mixer does it all hands-free.',                tip: 'If you bake more than twice a month, this will change your life.',             category: 'Upgrade'   },
  { icon: spatulaIcon,      name: 'Offset Spatula',             why: 'Perfect for spreading frosting, smoothing ganache, and transferring delicate items.',                    tip: "Get both a small (4\") and medium (8\") — they're used for different things.", category: 'Essential' },
  { icon: scraperIcon,      name: 'Bench Scraper',              why: "Divides dough, smooths cake sides, and cleans the counter in one swipe.",                               tip: "One of the most underrated and inexpensive tools in any baker's kit.",         category: 'Essential' },
  { icon: ovenThermIcon,    name: 'Oven Thermometer',           why: 'Most ovens run 10–25°C hotter or cooler than the dial says. Know your actual temperature.',              tip: 'Hang it in the center of the oven for the most accurate reading.',             category: 'Essential' },
  { icon: springformIcon,   name: 'Springform Pan',             why: "Essential for cheesecakes, tarts, and any cake you can't flip upside down.",                            tip: 'Line the bottom with parchment even with a non-stick pan.',                   category: 'Bakeware'  },
  { icon: doubleboilerIcon, name: 'Double Boiler / Bain-Marie', why: "Melts chocolate gently without burning. Also perfect for custards and curd.",                           tip: 'A heatproof bowl over a saucepan of simmering water works just as well.',     category: 'Technique' },
];

const categoryColors: Record<string, string> = {
  Essential: '#d4547a', Upgrade: '#7c3aed', Bakeware: '#0891b2', Technique: '#f59e0b',
};

export default function ToolsWeLovePage() {
  return (
    <StaticPage icon={pageIcon} title="Tools We Love" subtitle="The baking tools that actually make a difference">
      <div className="tools-legend">
        {Object.entries(categoryColors).map(([cat, color]) => (
          <span key={cat} className="tools-legend-badge" style={{ background: `${color}18`, color }}>
            {cat}
          </span>
        ))}
      </div>

      <div className="tools-grid">
        {tools.map((tool) => (
          <div key={tool.name} className="tool-card">
            <div className="tool-card-header">
              <img src={tool.icon} alt={tool.name} className="tool-icon" />
              <span
                className="tool-category-badge"
                style={{ background: `${categoryColors[tool.category]}18`, color: categoryColors[tool.category] }}
              >
                {tool.category}
              </span>
            </div>
            <h3 className="tool-name">{tool.name}</h3>
            <p className="tool-why">{tool.why}</p>
            <div className="tool-tip">
              <img src={tipIcon} alt="Tip" className="tool-tip-icon" />
              {tool.tip}
            </div>
          </div>
        ))}
      </div>
    </StaticPage>
  );
}