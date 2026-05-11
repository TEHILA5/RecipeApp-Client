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
    <div style={{ minHeight: '100vh', background: '#fdf2f8', paddingTop: 'var(--nav-height, 70px)', fontFamily: "'Nunito', sans-serif" }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #d4547a, #e8799a)', padding: '64px 24px', textAlign: 'center', color: 'white' }}>
        <img src={mailboxIcon} alt="Newsletter" style={{ width: '90px', height: '90px', objectFit: 'contain', marginBottom: '16px', placeSelf: 'center' }} />
        <h1 style={{ fontFamily: "'Dancing Script',cursive", fontSize: 'clamp(2.2rem, 4vw, 3rem)', marginBottom: '12px', color: 'white' }}>
          Sweet&Treat Newsletter
        </h1>
        <p style={{ opacity: 0.9, fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
          Monthly recipes, baking tips, and sweet inspiration — delivered straight to your inbox.
        </p>
      </div>

      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '48px 24px' }}>

        {isSuccess ? (
          <div style={{ background: 'white', borderRadius: '24px', padding: '48px 32px', textAlign: 'center', boxShadow: '0 8px 32px rgba(212,84,122,0.12)' }}>
            <img src={celebrateIcon} alt="Subscribed!" style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '16px', placeSelf: 'center' }} />
            <h2 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '2rem', color: '#d4547a', marginBottom: '12px' }}>
              You're subscribed!
            </h2>
            <p style={{ color: '#6b7280', lineHeight: 1.7, marginBottom: '8px' }}>
              Check your inbox — we just sent you our latest newsletter with featured recipes and baking tips.
            </p>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
              (Don't forget to check your spam folder if you don't see it!)
            </p>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '24px', padding: '40px 32px', boxShadow: '0 8px 32px rgba(212,84,122,0.1)' }}>
            <h2 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.8rem', color: '#d4547a', marginBottom: '8px', textAlign: 'center' }}>
              Join the Sweet Side
            </h2>
            <p style={{ color: '#9ca3af', textAlign: 'center', marginBottom: '32px', fontSize: '0.9rem' }}>
              Get our newsletter instantly — featuring this month's top recipes, a baking tip, and more.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Your Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sarah" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email Address *</label>
                <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} placeholder="hello@example.com" style={{ ...inputStyle, borderColor: errorMsg ? '#ef4444' : '#fce7f3' }} />
                {errorMsg && <p style={{ color: '#ef4444', fontSize: '0.82rem', marginTop: '6px' }}>{errorMsg}</p>}
              </div>

              <button onClick={handleSubmit} disabled={isLoading} style={{ padding: '14px', borderRadius: '999px', border: 'none', background: 'linear-gradient(135deg, #d4547a, #e8799a)', color: 'white', fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '1rem', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1, boxShadow: '0 4px 16px rgba(212,84,122,0.3)', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {isLoading
                  ? <><img src={sendingIcon} alt="Sending" style={{ width: '32px', height: '32px', objectFit: 'contain' }} /> Sending...</>
                  : 'Send Me the Newsletter'
                }
              </button>

              <p style={{ color: '#9ca3af', fontSize: '0.78rem', textAlign: 'center', marginTop: '4px' }}>
                No spam, ever. Just sweetness. Unsubscribe anytime.
              </p>
            </div>
          </div>
        )}

        {/* What's inside */}
        <div style={{ marginTop: '40px' }}>
          <h3 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.5rem', color: '#d4547a', textAlign: 'center', marginBottom: '20px' }}>
            What's Inside
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {WHATS_INSIDE.map((item) => (
              <div key={item.title} style={{ background: 'white', borderRadius: '16px', padding: '18px', boxShadow: '0 2px 12px rgba(212,84,122,0.07)', textAlign: 'center' }}>
                <img src={item.icon} alt={item.title} style={{ width: '40px', height: '40px', objectFit: 'contain', marginBottom: '8px', placeSelf: 'center' }} />
                <div style={{ fontWeight: 800, color: '#374151', fontSize: '0.88rem', marginBottom: '4px' }}>{item.title}</div>
                <div style={{ color: '#9ca3af', fontSize: '0.78rem' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
