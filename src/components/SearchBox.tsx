import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';

const SearchBox = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleIconClick = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  useEffect(() => {
    const searchProducts = async () => {
      if (!query.trim()) {
        setResults([]);
        setShowResults(false);
        return;
      }
      
      try {
        const response = await productsAPI.search(query);
        setResults(response.data.slice(0, 5));
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
      }
    };

    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearch} className="_searchbox relative">
        <FiSearch
          className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 cursor-pointer z-10"
          size={20}
          onClick={handleIconClick}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products"
          className="outline-none w-full text-[14px] bg-transparent"
          onFocus={() => query && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />
      </form>
      
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {results.map(product => (
            <div
              key={product.id}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
              onClick={() => {
                navigate(`/prn/${product.name}/prid/${product.id}`);
                setShowResults(false);
                setQuery('');
              }}
            >
              <div className="flex items-center gap-3">
                <img 
                  src={(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3002') + (product.image || '/uploads/placeholder.png')}
                  alt={product.name} 
                  className="w-10 h-10 object-contain bg-gray-100 rounded"
                />
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
  );
};

export default SearchBox;
