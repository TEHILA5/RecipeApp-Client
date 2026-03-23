import { useState } from 'react';
import axiosInstance from '../../../api/axiosConfig';
import { useGetRecipesQuery } from '../../recipe/redux/recipeSlice';
import { StaticPage } from './StaticPageHelpers';
import './ContactPage.css';

const CATEGORIES = [
  'Recipe Question',
  'Ingredient Help',
  'Technical Issue',
  'Recipe Suggestion',
  'Feedback',
  'Other',
];

const URGENCY_OPTIONS = [
  { value: 'Low', label: '🟢 Low — No rush', color: '#16a34a' },
  { value: 'Normal', label: '🟡 Normal — Within a few days', color: '#ca8a04' },
  { value: 'High', label: '🔴 High — Urgent', color: '#dc2626' },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    category: '',
    recipeName: '',
    message: '',
    urgency: 'Normal',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const { data: recipes = [] } = useGetRecipesQuery();

  const updateField = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrorMsg('');
  };

  const validate = () => {
    if (!form.name.trim()) return setErrorMsg('Please enter your name'), false;
    if (!form.email.includes('@')) return setErrorMsg('Please enter a valid email'), false;
    if (!form.category) return setErrorMsg('Please select a category'), false;
    if (form.message.trim().length < 10)
      return setErrorMsg('Please write at least 10 characters'), false;

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setStatus('loading');

    try {
      await axiosInstance.post('/contact/send', {
        name: form.name.trim(),
        email: form.email.trim(),
        category: form.category,
        recipeName: form.recipeName.trim() || null,
        message: form.message.trim(),
        urgency: form.urgency,
      });

      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <StaticPage emoji="✅" title="Message Sent!" subtitle="We'll get back to you soon">
        <div className="contact-success">
          <div className="contact-success-icon">💌</div>
          <h2 className="contact-success-title">Got your message!</h2>
          <p className="contact-success-text">
            Thank you <strong>{form.name}</strong>, we’ll reply to <strong>{form.email}</strong> soon.
          </p>
          <p className="contact-success-small">Typical response time: 24–48 hours.</p>
        </div>
      </StaticPage>
    );
  }

  return (
    <StaticPage emoji="💌" title="Contact Us" subtitle="We'd love to hear from you">
      <p className="contact-intro">
        Have a question, suggestion or issue? Send us a message.
      </p>

      <div className="contact-card">
        {/* Name + Email */}
        <div className="contact-grid">
          <div>
            <label className="contact-label">Your Name *</label>
            <input
              className="contact-input"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
            />
          </div>

          <div>
            <label className="contact-label">Email *</label>
            <input
              className="contact-input"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
            />
          </div>
        </div>

        {/* Category */}
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

        {/* Recipe */}
        <div>
          <label className="contact-label">Related Recipe (optional)</label>
          <select
            className="contact-input"
            value={form.recipeName}
            onChange={(e) => updateField('recipeName', e.target.value)}
          >
            <option value="">No recipe</option>
            {recipes.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div>
          <label className="contact-label">Message *</label>
          <textarea
            className="contact-textarea"
            value={form.message}
            onChange={(e) => updateField('message', e.target.value)}
          />

          <div className="contact-counter">
            {form.message.length} characters
          </div>
        </div>

        {/* Urgency */}
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
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {errorMsg && <div className="contact-error">{errorMsg}</div>}

        <button
          className="contact-submit"
          onClick={handleSubmit}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </StaticPage>
  );
}