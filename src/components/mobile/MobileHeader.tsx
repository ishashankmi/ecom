import { FiSearch, FiShoppingCart } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks';
import { useState, useEffect } from 'react';
import { productsAPI } from '../../services/api';
import LocationPicker from '../LocationPicker';

export default function MobileHeader() {
  const { totalQuantity } = useAppSelector(state => state.cart);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const searchProducts = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      
      try {
        const response = await productsAPI.search(query);
        setResults(response.data.slice(0, 5));
      } catch (error) {
        console.error('Search error:', error);
      }
    };

    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <Link to="/">
            <span className="font-black text-xl text-yellow-400 tracking-tight" style={{color: '#0041c2'}}>
              Saras
            </span>
          </Link>
          <LocationPicker />
        </div>
        
        <div className="flex items-center space-x-4">
        <button onClick={() => setShowSearch(!showSearch)}>
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
      
      {showSearch && (
        <div className="md:hidden fixed top-[60px] left-0 right-0 bg-white border-b border-gray-200 p-4 z-50">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full p-2 border rounded-lg outline-none"
            autoFocus
          />
          
          {results.length > 0 && (
            <div className="mt-2 max-h-60 overflow-y-auto">
              {results.map(product => (
                <div
                  key={product.id}
                  className="p-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  onClick={() => {
                    navigate(`/prn/${product.name}/prid/${product.id}`);
                    setShowSearch(false);
                    setQuery('');
                    setResults([]);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <img src={(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3002') + (product.image || '/uploads/placeholder.png')} alt={product.name} className="w-8 h-8 object-contain" />
                    <div>
                      <div className="font-medium text-sm">{product.name}</div>
                      <div className="text-xs text-gray-500">₹{product.price}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}