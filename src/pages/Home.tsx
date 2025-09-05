import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchProducts } from '../store/products';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  console.log('Products state:', { products, loading, error });

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (!products.length) {
    return <div className="text-center py-8">No products found</div>;
  }

  return (
    <div className="_container overflow-x-hidden p-4">
      <h2 className="text-2xl font-bold mb-6">All Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;
