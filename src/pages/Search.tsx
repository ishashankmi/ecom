import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const query = searchParams.get('q') || '';
  
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    const searchProducts = async () => {
      console.log('Search page - query:', query);
      if (!query.trim()) {
        setProducts([]);
        return;
      }
      
      setLoading(true);
      try {
        console.log('Making API call for search:', query);
        const response = await productsAPI.search(query);
        console.log('Search API response:', response.data);
        setProducts(response.data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  if (loading) {
    return <div className="text-center py-8">Searching...</div>;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="_container pt-6 p-4">
      {/* Search Input */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
          <FiSearch className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" size={20} />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for products"
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </form>
      </div>
      
      {query && (
        <h1 className="text-2xl font-bold mb-6">
          Search results for "{query}"
        </h1>
      )}
      
      {loading ? (
        <div className="text-center py-8">Searching...</div>
      ) : query && products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No products found for "{query}"
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Enter a search term to find products
        </div>
      )}
    </div>
  );
}