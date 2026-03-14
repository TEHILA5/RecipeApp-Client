// ===============================================
// SearchBar - חיפוש לפי שם
// ===============================================
interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Search...' }: SearchBarProps) {
  return (
    <div style={{ position: 'relative' }}>
      <input
        autoFocus
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '14px 48px 14px 20px',
          border: '2px solid #fce7f3', borderRadius: '999px',
          fontFamily: "'Nunito',sans-serif", fontSize: '1rem',
          background: '#fffbfd', outline: 'none', boxSizing: 'border-box',
          transition: 'border-color 0.2s',
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = '#d4547a')}
        onBlur={(e) => (e.currentTarget.style.borderColor = '#fce7f3')}
      />
      <span style={{
        position: 'absolute', right: '18px', top: '50%',
        transform: 'translateY(-50%)', fontSize: '1.2rem', pointerEvents: 'none',
      }}>🔍</span>
    </div>
  );
}
