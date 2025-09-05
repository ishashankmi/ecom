import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiSearch, FiShoppingCart, FiUser, FiList } from 'react-icons/fi';
import { useAppSelector } from '../../hooks';

export default function BottomNavbar() {
  const location = useLocation();
  const { totalQuantity } = useAppSelector(state => state.cart);
  const { user } = useAppSelector(state => state.auth);

  const navItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/search', icon: FiSearch, label: 'Search' },
    { path: '/cart', icon: FiShoppingCart, label: 'Cart', badge: totalQuantity },
    { path: '/orders', icon: FiList, label: 'Orders' },
    { path: user ? '/profile' : '/login', icon: FiUser, label: user ? 'Profile' : 'Login' },
  ];

  return (
    <div className="bg-white border-t border-gray-200 md:hidden" style={{position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999, transform: 'translate3d(0, 0, 0)', willChange: 'transform'}}>
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ path, icon: Icon, label, badge }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center py-2 px-3 relative ${
              location.pathname === path
                ? 'text-green-600'
                : 'text-gray-500 hover:text-green-600'
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
            <span className="text-xs mt-1">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}