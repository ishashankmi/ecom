import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Search() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const query = searchParams.get('q') || '';

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

  return (
    <div className="_container pt-6 p-4">
      <h1 className="text-2xl font-bold mb-6">
        Search results for "{query}"
      </h1>
      
      {products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No products found for "{query}"
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}