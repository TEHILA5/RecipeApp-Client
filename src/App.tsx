// ===============================================
// Main App Component - Sweet&Treat Theme
// ===============================================
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { store } from './app/store';
import { checkAuth } from './features/auth/redux/authSlice';
import AppRoutes from './routes/AppRoutes';
import theme from './styles/themes/muiTheme';
import Toast from './shared/components/UI/Toast';
import './styles/global.css';
import './App.css';

function App() {
  useEffect(() => {
    store.dispatch(checkAuth());

    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
      }, 1800);
    }
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppRoutes />
          {/* ✅ Toast גלובלי - נגיש מכל מקום דרך dispatch(addToast(...)) */}
          <Toast />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
