import { useAppDispatch } from '../hooks/useAppDispatch';
import { login } from '../store/auth';

export default function TestLogin() {
  const dispatch = useAppDispatch();

  const testAdminLogin = async () => {
    try {
      const result = await dispatch(login({
        email: 'admin@Saras.com',
        password: 'admin123'
      })).unwrap();
      console.log('Test login result:', result);
    } catch (error) {
      console.error('Test login error:', error);
    }
  };

  return (
    <div className="p-4">
      <button 
        onClick={testAdminLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Test Admin Login
      </button>
    </div>
  );
}