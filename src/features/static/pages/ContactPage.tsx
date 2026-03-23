import { StaticPage, Section, labelStyle, inputStyle } from './StaticPageHelpers';

export default function ContactPage() {
  return (
    <StaticPage emoji="💌" title="Contact Us" subtitle="We'd love to hear from you">
      <Section title="Get in Touch">
        Have a question, a recipe suggestion, or just want to say hello?
        We read every message and do our best to reply within 48 hours.
      </Section>
      <div style={{ background: '#fdf2f8', borderRadius: '20px', padding: '32px', marginTop: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Your Name</label>
            <input style={inputStyle} placeholder="e.g. Sarah Baker" disabled />
          </div>
          <div>
            <label style={labelStyle}>Email Address</label>
            <input style={inputStyle} placeholder="hello@example.com" disabled />
          </div>
          <div>
            <label style={labelStyle}>Message</label>
            <textarea style={{ ...inputStyle, height: '120px', resize: 'none' }} placeholder="Tell us what's on your mind..." disabled />
          </div>
          <p style={{ color: '#9ca3af', fontSize: '0.82rem', marginTop: '4px' }}>
            📧 Or email us directly at <strong style={{ color: '#d4547a' }}>hello@sweetandtreat.com</strong>
          </p>
          <button style={{ padding: '12px 32px', borderRadius: '999px', border: 'none', background: 'linear-gradient(135deg, #e8799a, #d4547a)', color: 'white', fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.9rem', cursor: 'not-allowed', opacity: 0.7 }} disabled>
            Send Message (Coming Soon)
          </button>
        </div>
      </div>
    </StaticPage>
  );
}
