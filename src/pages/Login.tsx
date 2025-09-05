import { useState } from 'react';
import NewLoginForm from '../components/auth/NewLoginForm';
import RegisterForm from '../components/auth/RegisterForm';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {isLogin ? <NewLoginForm /> : <RegisterForm />}
        
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-green-600 hover:underline"
          >
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}