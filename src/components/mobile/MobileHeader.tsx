import { FiMenu, FiSearch, FiShoppingCart } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../hooks';

export default function MobileHeader() {
  const { totalQuantity } = useAppSelector(state => state.cart);

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-50">
      <div className="flex items-center">
        <button className="mr-3">
          <FiMenu size={24} />
        </button>
        <Link to="/">
          <span className="font-black text-2xl text-yellow-400 tracking-tight">
            bring<strong className="text-green-600">It</strong>
          </span>
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        <button>
          <FiSearch size={24} />
        </button>
        <Link to="/cart" className="relative">
          <FiShoppingCart size={24} />
          {totalQuantity > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
              {totalQuantity > 99 ? '99+' : totalQuantity}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}