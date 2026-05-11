import Input from '../../../shared/components/UI/Input';
import './SearchBar.css';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Search...' }: SearchBarProps) {
  return (
    <div className="search-bar-wrap">
      <Input
        autoFocus
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-bar-input"
      />
      <span className="search-bar-icon">
        <img src="/src/assets/icons/search-icon.png" alt="Search" style={{ width: '30px', height: '30px', objectFit: 'contain', verticalAlign: 'middle' }}/>
      </span>
    </div>
  );
}
