import { useState } from 'react';
import { useSubscribeNewsletterMutation } from '../../../api/contactApi';
import { labelStyle, inputStyle } from './staticStyles';

import mailboxIcon   from '../../../assets/icons/newsletter-mailbox.png';
import celebrateIcon from '../../../assets/icons/newsletter-celebrate.png';
import sendingIcon   from '../../../assets/icons/newsletter-sending.png';
import featuredIcon  from '../../../assets/icons/newsletter-featured.png';
import chefTipIcon   from '../../../assets/icons/newsletter-chef-tip.png';
import searchIcon    from '../../../assets/icons/search-icon.png';
import seasonalIcon  from '../../../assets/icons/newsletter-seasonal.png';
import './NewsletterPage.css';

const WHATS_INSIDE = [
  { icon: featuredIcon, title: 'Featured Recipes', desc: '3 hand-picked recipes every month' },
  { icon: chefTipIcon,  title: 'Baking Tip',        desc: 'One pro secret to level up your baking' },
  { icon: searchIcon,   title: 'Smart Search',       desc: 'Learn how to find recipes by description' },
  { icon: seasonalIcon, title: 'Seasonal Picks',     desc: 'What to bake right now, this season' },
];

export default function NewsletterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [subscribeNewsletter, { isLoading, isSuccess }] = useSubscribeNewsletterMutation();

  const handleSubmit = async () => {
    if (!email.trim()) { setErrorMsg('Email is required'); return; }
    if (!email.includes('@')) { setErrorMsg('Please enter a valid email'); return; }
    setErrorMsg('');
    try {
      await subscribeNewsletter({ email: email.trim(), name: name.trim() || 'Sweet Lover' }).unwrap();
    } catch { setErrorMsg('Something went wrong. Please try again.'); }
  };

  return (
    <div className="newsletter-page">

      <header className="newsletter-header">
        <img src={mailboxIcon} alt="Newsletter" className="newsletter-header-icon" />
        <h1 className="newsletter-header-title">Sweet&Treat Newsletter</h1>
        <p className="newsletter-header-subtitle">
          Monthly recipes, baking tips, and sweet inspiration — delivered straight to your inbox.
        </p>
      </header>

      <div className="newsletter-body">

        {isSuccess ? (
          <div className="newsletter-card newsletter-success">
            <img src={celebrateIcon} alt="Subscribed!" className="newsletter-success-icon" />
            <h2 className="newsletter-card-heading">You're subscribed!</h2>
            <p className="newsletter-success-text">
              Check your inbox — we just sent you our latest newsletter with featured recipes and baking tips.
            </p>
            <p className="newsletter-success-note">
              (Don't forget to check your spam folder if you don't see it!)
            </p>
          </div>
        ) : (
          <div className="newsletter-card">
            <h2 className="newsletter-card-heading newsletter-card-heading--center">Join the Sweet Side</h2>
            <p className="newsletter-card-sub">
              Get our newsletter instantly — featuring this month's top recipes, a baking tip, and more.
            </p>

            <div className="newsletter-form">
              <div>
                <label style={labelStyle}>Your Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sarah" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="hello@example.com"
                  style={{ ...inputStyle, borderColor: errorMsg ? '#ef4444' : '#fce7f3' }}
                />
                {errorMsg && <p className="newsletter-error">{errorMsg}</p>}
              </div>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`newsletter-submit${isLoading ? ' newsletter-submit--loading' : ''}`}
              >
                {isLoading
                  ? <><img src={sendingIcon} alt="Sending" className="newsletter-sending-icon" /> Sending...</>
                  : 'Send Me the Newsletter'
                }
              </button>

              <p className="newsletter-disclaimer">
                No spam, ever. Just sweetness. Unsubscribe anytime.
              </p>
            </div>
          </div>
        )}

        <div className="whats-inside">
          <h3 className="whats-inside-title">What's Inside</h3>
          <div className="whats-inside-grid">
            {WHATS_INSIDE.map((item) => (
              <article key={item.title} className="whats-inside-card">
                <img src={item.icon} alt={item.title} className="whats-inside-icon" />
                <div className="whats-inside-card-title">{item.title}</div>
                <div className="whats-inside-card-desc">{item.desc}</div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}