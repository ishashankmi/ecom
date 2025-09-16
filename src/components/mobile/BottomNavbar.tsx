import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiSearch, FiShoppingCart, FiUser, FiList } from 'react-icons/fi';
import { useAppSelector } from '../../hooks';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { logoutAsync } from '../../store/auth';

export default function BottomNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { totalItems } = useAppSelector(state => state.cart);
  const { user } = useAppSelector(state => state.auth);

  const handleUserAction = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  const navItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/search', icon: FiSearch, label: 'Search' },
    { path: '/cart', icon: FiShoppingCart, label: 'Cart', badge: totalItems },
    { path: '/orders', icon: FiList, label: 'Orders' },
  ];

  return (
    <div className="bg-white border-t border-gray-200 md:hidden" style={{position: 'fixed', bottom: '0px', left: 0, right: 0, zIndex: 9999, transform: 'translate3d(0, 0, 0)', willChange: 'transform'}}>
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ path, icon: Icon, label, badge }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center py-2 px-3 relative ${
              location.pathname === path
                ? 'text-primary'
                : 'text-gray-500 hover:text-primary'
            }`}
          >
            <div className="relative">
              <Icon size={20} />
              {badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {badge > 99 ? '99+' : badge}
                </span>
              )}
            </div>
            <span className="text-xs mt-1 truncate">{label}</span>
          </Link>
        ))}
        <button
          onClick={handleUserAction}
          className="flex flex-col items-center py-2 px-3 text-gray-500 hover:text-primary"
        >
          <FiUser size={20} />
          <span className="text-xs mt-1">{user ? 'Profile' : 'Login'}</span>
        </button>
      </div>
    </div>
  );
}