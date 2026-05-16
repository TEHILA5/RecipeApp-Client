import { useState } from 'react';
import { useSendContactMessageMutation } from '../../../api/contactApi';
import { useGetRecipesQuery } from '../../recipe/redux/recipeSlice';
import { StaticPage } from './StaticPageHelpers';
import './ContactPage.css';

import pageIcon           from '../../../assets/icons/page-contact.png';
import pageSuccessIcon    from '../../../assets/icons/page-success.png';
import priorityLowIcon    from '../../../assets/icons/priority-low.png';
import priorityNormalIcon from '../../../assets/icons/priority-normal.png';
import priorityHighIcon   from '../../../assets/icons/priority-high.png';
import successEnvelope    from '../../../assets/icons/contact-success-envelope.png';

const CATEGORIES = [
  'Recipe Question', 'Ingredient Help', 'Technical Issue',
  'Recipe Suggestion', 'Feedback', 'Other',
];

const URGENCY_OPTIONS = [
  { value: 'Low',    label: 'Low — No rush',              color: '#16a34a', icon: priorityLowIcon    },
  { value: 'Normal', label: 'Normal — Within a few days', color: '#ca8a04', icon: priorityNormalIcon },
  { value: 'High',   label: 'High — Urgent',              color: '#dc2626', icon: priorityHighIcon   },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '', email: '', category: '', recipeName: '', message: '', urgency: 'Normal',
  });
  const [errorMsg, setErrorMsg] = useState('');

  const { data: recipes = [] } = useGetRecipesQuery();
  const [sendContactMessage, { isLoading, isSuccess }] = useSendContactMessageMutation();

  const updateField = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrorMsg('');
  };

  const validate = () => {
    if (!form.name.trim())               return setErrorMsg('Please enter your name'), false;
    if (!form.email.includes('@'))       return setErrorMsg('Please enter a valid email'), false;
    if (!form.category)                  return setErrorMsg('Please select a category'), false;
    if (form.message.trim().length < 10) return setErrorMsg('Please write at least 10 characters'), false;
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await sendContactMessage({
        name: form.name.trim(), email: form.email.trim(), category: form.category,
        recipeName: form.recipeName.trim() || null, message: form.message.trim(), urgency: form.urgency,
      }).unwrap();
    } catch { setErrorMsg('Something went wrong. Please try again.'); }
  };

  if (isSuccess) {
    return (
      <StaticPage icon={pageSuccessIcon} title="Message Sent!" subtitle="We'll get back to you soon">
        <div className="contact-success">
          <div className="contact-success-icon">
            <img src={successEnvelope} alt="Message sent" className="contact-success-envelope" />
          </div>
          <h2 className="contact-success-title">Got your message!</h2>
          <p className="contact-success-text">
            Thank you <strong>{form.name}</strong>, we'll reply to <strong>{form.email}</strong> soon.
          </p>
          <p className="contact-success-small">Typical response time: 24–48 hours.</p>
        </div>
      </StaticPage>
    );
  }

  return (
    <StaticPage icon={pageIcon} title="Contact Us" subtitle="We'd love to hear from you">
      <p className="contact-intro">Have a question, suggestion or issue? Send us a message.</p>

      <div className="contact-card">
        <div className="contact-grid">
          <div>
            <label className="contact-label">Your Name *</label>
            <input className="contact-input" value={form.name} onChange={(e) => updateField('name', e.target.value)} />
          </div>
          <div>
            <label className="contact-label">Email *</label>
            <input className="contact-input" value={form.email} onChange={(e) => updateField('email', e.target.value)} />
          </div>
        </div>

        <div>
          <label className="contact-label">Category *</label>
          <div className="contact-categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`contact-chip ${form.category === cat ? 'active' : ''}`}
                onClick={() => updateField('category', cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="contact-label">Related Recipe (optional)</label>
          <select className="contact-input" value={form.recipeName} onChange={(e) => updateField('recipeName', e.target.value)}>
            <option value="">No recipe</option>
            {recipes.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
          </select>
        </div>

        <div>
          <label className="contact-label">Message *</label>
          <textarea className="contact-textarea" value={form.message} onChange={(e) => updateField('message', e.target.value)} />
          <div className="contact-counter">{form.message.length} characters</div>
        </div>

        <div>
          <label className="contact-label">Priority</label>
          <div className="contact-urgency">
            {URGENCY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`contact-chip ${form.urgency === opt.value ? 'active' : ''}`}
                style={{ borderColor: opt.color }}
                onClick={() => updateField('urgency', opt.value)}
              >
                <img src={opt.icon} alt={opt.value} className="priority-icon" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {errorMsg && <div className="contact-error">{errorMsg}</div>}

        <button className="contact-submit" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </StaticPage>
  );
}