import { useState } from 'react';
import { useSendReplyMutation } from '../../../api/adminApi';
import './AdminReplyPage.css';

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

  const [error, setError] = useState('');
  const [sendReply, { isLoading, isSuccess }] = useSendReplyMutation();

  const update = (key: keyof Form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError('');
  };

  const validate = () => {
    if (!form.toEmail.includes('@')) return setError('Invalid email'), false;
    if (!form.toName.trim()) return setError('Name required'), false;
    if (!form.subject.trim()) return setError('Subject required'), false;
    if (form.replyContent.trim().length < 10) return setError('Message too short'), false;
    return true;
  };

  const send = async () => {
    if (!validate()) return;
    try {
      await sendReply({
        toEmail: form.toEmail.trim(),
        toName: form.toName.trim(),
        subject: form.subject.trim(),
        replyContent: form.replyContent.trim(),
      }).unwrap();
    } catch {
      setError('Failed to send reply');
    }
  };

  const reset = () => {
    setForm({ toEmail: '', toName: '', subject: '', replyContent: '' });
    setError('');
  };

  if (isSuccess) {
    return (
      <div className="reply-page">
        <div className="success-box">
          <div className="big-icon">
            <img src="/src/assets/icons/profile-success.png" alt="Success" className="success-icon" />
          </div>
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
        <h1 className="title">
          Reply to Contact
          <img src="/src/assets/icons/page-contact.png" alt="" className="title-icon" />
        </h1>

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

        <button onClick={send} disabled={isLoading} className="primary-btn">
          {isLoading ? 'Sending...' : 'Send Reply'}
        </button>

        <button onClick={reset} className="secondary-btn">
          Clear
        </button>
      </div>
    </div>
  );
}