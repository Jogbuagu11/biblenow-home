import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to login page after a short delay
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-biblenow-brown">
      <div className="auth-card w-full max-w-md p-6">
        <h1 className="text-3xl font-serif font-semibold text-biblenow-gold mb-4">404</h1>
        <h2 className="text-2xl font-serif font-semibold text-biblenow-beige mb-6">Page Not Found</h2>
        <p className="text-biblenow-beige/60 mb-8">
          The page you're looking for doesn't exist. You'll be redirected to the login page shortly.
        </p>
        <button
          onClick={() => navigate('/')}
          className="auth-btn-primary w-full"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default NotFound;
