import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import NewLoginForm from '../components/auth/NewLoginForm';
import RegisterForm from '../components/auth/RegisterForm';

export default function Login() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {isLogin ? <NewLoginForm /> : <RegisterForm />}
        
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}