// ===============================================
// SearchBar - חיפוש לפי שם
// ===============================================
import Input from '../../UI/Input';
interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Search...' }: SearchBarProps) {
  return (
    <div style={{ position: 'relative' }}>
      {/* ✅ Input component */}
      <Input
        autoFocus
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ paddingRight: '48px', borderRadius: '999px' }}
      />
      <span style={{
        position: 'absolute', right: '18px', top: '50%',
        transform: 'translateY(-50%)', fontSize: '1.2rem', pointerEvents: 'none',
      }}>🔍</span>
    </div>
  );
}
