import UserManagement from '../components/UserManagement';
import './ManageUsers.css';

export default function ManageUsers() {
  return (
    <div className="mu-page">
      <div className="mu-inner">
        <h1 className="mu-title">
          Manage Users
          <img src="/src/assets/icons/profile-avatar.png" alt="" className="mu-title-icon" />
        </h1>
        <UserManagement />
      </div>
    </div>
  );
}