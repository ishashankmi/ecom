import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchProducts, fetchProductsByCategory } from '../store/products';
import ProductCard from '../components/ProductCard';
import CategorySelection from '../components/CategorySelection';

const Home = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector(state => state.products);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts()).finally(() => setInitialLoad(false));
    } else {
      setInitialLoad(false);
    }
  }, [dispatch, products.length]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    dispatch(fetchProductsByCategory(categoryId));
  };

  const filteredProducts = products;
  const { categories } = useAppSelector(state => state.categories);
  const selectedCategoryName = selectedCategory === 'all' ? 'All' : categories.find(cat => cat.id.toString() === selectedCategory)?.name || 'Unknown';

  if (initialLoad && loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (!products.length && !loading) {
    return <div className="text-center py-8">No products found</div>;
  }

  return (
    <div className="_container overflow-x-hidden p-4">
      <CategorySelection 
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />
      
      <h2 className="text-2xl font-bold mb-6 capitalize">
        {selectedCategoryName}
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {filteredProducts.length === 0 && selectedCategory !== 'all' && (
        <div className="text-center py-8 text-gray-500">
          No products found in "{selectedCategory}" category
        </div>
      )}
    </div>
  );
};

export default Home;
