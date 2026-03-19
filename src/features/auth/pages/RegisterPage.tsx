import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { registerUser, clearError } from '../redux/authSlice';
import RegisterForm from '../components/RegisterForm';
import './LoginPage.css';

interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((s) => s.auth);

  useEffect(() => { dispatch(clearError()); }, [dispatch]);
  useEffect(() => { if (isAuthenticated) navigate('/'); }, [isAuthenticated, navigate]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = data;
      await dispatch(registerUser(registerData)).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-visual">
          <div className="visual-content">
            <h2 className="visual-title">Join Sweet&amp;Treat!</h2>
            <p className="visual-desc">
              Create your free account and start your delicious journey.
              Discover thousands of amazing dessert recipes crafted with love! 🍰
            </p>
            <div className="visual-emoji">✨🧁🍪🎂</div>
          </div>
        </div>
        <div className="login-form-wrapper">
          <RegisterForm onSubmit={onSubmit} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
