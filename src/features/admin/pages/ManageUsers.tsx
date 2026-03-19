import UserManagement from '../components/UserManagement';
import './ManageUsers.css';

export default function ManageUsers() {
  return (
    <div className="mu-page">
      <div className="mu-inner">
        <h1 className="mu-title">Manage Users 👤</h1>
        <UserManagement />
      </div>
    </div>
  );
}
