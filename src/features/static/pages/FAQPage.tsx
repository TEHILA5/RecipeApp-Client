import { StaticPage } from './StaticPageHelpers';
import pageIcon from '../../../assets/icons/page-faq.png';

const faqs = [
  { q: 'Can I submit my own recipes?',          a: "Yes! You can now send your own recipe ideas and suggestions directly to the admin through the contact form." },
  { q: 'Are the recipes tested?',               a: 'Yes! Every recipe on Sweet&Treat has been tested in a real kitchen before publishing.' },
  { q: 'Can I save recipes to my favorites?',   a: 'Absolutely — just create a free account and click the bookmark icon on any recipe.' },
  { q: 'Are there vegan or gluten-free options?', a: 'Yes! Use the search filters or look for the #vegan and #gluten-free tags.' },
  { q: 'How do I convert measurements?',        a: 'Check out our Conversions page — it has a full ingredient conversion calculator.' },
  { q: 'Can I rate and comment on recipes?',    a: 'Yes, registered users can leave ratings and comments on any recipe.' },
];

export default function FAQPage() {
  return (
    <StaticPage icon={pageIcon} title="FAQ" subtitle="Frequently Asked Questions">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {faqs.map((item, i) => (
          <div key={i} style={{ background: '#fdf2f8', borderRadius: '16px', padding: '20px 24px', borderLeft: '4px solid #d4547a' }}>
            <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, color: '#d4547a', marginBottom: '8px', fontSize: '1rem' }}>
              {item.q}
            </h3>
            <p style={{ color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{item.a}</p>
          </div>
        ))}
      </div>
    </StaticPage>
  );
}
