import { useState } from 'react';
import axiosInstance from '../../../api/axiosConfig';
import './AdminReplyPage.css';

type Status = 'idle' | 'loading' | 'success' | 'error';

type Form = {
  toEmail: string;
  toName: string;
  subject: string;
  replyContent: string;
};

export default function AdminReplyPage() {
  const [form, setForm] = useState<Form>({
    toEmail: '',
    toName: '',
    subject: '',
    replyContent: '',
  });

  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const update = (key: keyof Form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError('');
  };

  const validate = () => {
    if (!form.toEmail.includes('@')) return setError('Invalid email'), false;
    if (!form.toName.trim()) return setError('Name required'), false;
    if (!form.subject.trim()) return setError('Subject required'), false;
    if (form.replyContent.trim().length < 10)
      return setError('Message too short'), false;
    return true;
  };

  const send = async () => {
    if (!validate()) return;

    setStatus('loading');

    try {
      await axiosInstance.post('/contact/reply', {
        toEmail: form.toEmail.trim(),
        toName: form.toName.trim(),
        subject: form.subject.trim(),
        replyContent: form.replyContent.trim(),
      });

      setStatus('success');
    } catch {
      setStatus('error');
      setError('Failed to send reply');
    }
  };

  const reset = () => {
    setForm({ toEmail: '', toName: '', subject: '', replyContent: '' });
    setStatus('idle');
    setError('');
  };

  if (status === 'success') {
    return (
      <div className="reply-page">
        <div className="success-box">
          <div className="big-icon">✅</div>
          <h2>Reply Sent!</h2>

          <button onClick={reset} className="primary-btn">
            Send Another Reply
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reply-page">

      <div className="reply-card">

        <h1 className="title">Reply to Contact 💌</h1>

        <input
          placeholder="Name"
          value={form.toName}
          onChange={(e) => update('toName', e.target.value)}
          className="input"
        />

        <input
          placeholder="Email"
          value={form.toEmail}
          onChange={(e) => update('toEmail', e.target.value)}
          className="input"
        />

        <input
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => update('subject', e.target.value)}
          className="input"
        />

        <textarea
          placeholder="Reply"
          value={form.replyContent}
          onChange={(e) => update('replyContent', e.target.value)}
          className="textarea"
        />

        {error && <p className="error">{error}</p>}

        <button
          onClick={send}
          disabled={status === 'loading'}
          className="primary-btn"
        >
          {status === 'loading' ? 'Sending...' : 'Send Reply'}
        </button>

        <button onClick={reset} className="secondary-btn">
          Clear
        </button>

      </div>
    </div>
  );
}