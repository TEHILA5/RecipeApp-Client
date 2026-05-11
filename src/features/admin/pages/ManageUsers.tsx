import UserManagement from '../components/UserManagement';
import './ManageUsers.css';

export default function ManageUsers() {
  return (
    <div className="mu-page">
      <div className="mu-inner">
        <h1 className="mu-title">
          Manage Users{' '}
          <img src="/src/assets/icons/profile-avatar.png" alt="" style={{ width: '1em', height: '1em', objectFit: 'contain', verticalAlign: 'middle' }} />
        </h1>
        <UserManagement />
      </div>
    </div>
  );
}