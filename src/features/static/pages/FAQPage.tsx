import { StaticPage } from './StaticPageHelpers';
import pageIcon from '../../../assets/icons/page-faq.png';
import './FAQPage.css';

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
      <div className="faq-list">
        {faqs.map((item, i) => (
          <div key={i} className="faq-item">
            <h3 className="faq-question">{item.q}</h3>
            <p className="faq-answer">{item.a}</p>
          </div>
        ))}
      </div>
    </StaticPage>
  );
}