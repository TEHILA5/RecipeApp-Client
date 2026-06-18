import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../redux/hooks';
import { useRegisterMutation } from '../../../api/authApi';
import { clearError } from '../redux/authSlice';
import { useAppDispatch } from '../../../redux/hooks';
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
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const [register, { isLoading, error }] = useRegisterMutation();

  useEffect(() => { dispatch(clearError()); }, [dispatch]);
  useEffect(() => { if (isAuthenticated) navigate('/'); }, [isAuthenticated, navigate]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { confirmPassword, ...registerData } = data;
      void confirmPassword;
      await register(registerData).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const errorMessage = (() => {
  if (!error) return null;

  const err = error as { data?: { errors?: Record<string, string[]>; title?: string; message?: string;  } };

  if (err.data) {
    if (err.data.errors) {
      const messages = Object.values(err.data.errors).flat();
      if (messages.length > 0) return messages.join(', ');
    }
    if (err.data.message) return err.data.message;
    if (err.data.title) return err.data.title;
  }

  return 'Registration failed';
  })();
  

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-visual">
          <div className="visual-content">
            <h2 className="visual-title">Join Sweet&amp;Treat!</h2>
            <p className="visual-desc">
              Create your free account and start your delicious journey.
              Discover thousands of amazing dessert recipes crafted with love!
            </p>
            <div className="visual-emoji">
              <img src="/src/assets/images/sweety.png" alt="Logo" className="visual-hero-img" />
            </div>
          </div>
        </div>
        <div className="login-form-wrapper">
          <RegisterForm onSubmit={onSubmit} loading={isLoading} error={errorMessage} />
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;