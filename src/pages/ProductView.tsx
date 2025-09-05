import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { productsAPI } from '../services/api';
import AddToCartButton from '../components/shared/AddToCartButton';

const ProductView = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productsAPI.getById(id!);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading product...</div>;
  }

  if (!product) {
    return <div className="text-center py-8">Product not found</div>;
  }

  const cartProduct = {
    id: product.id.toString(),
    title: product.name,
    subTitle: product.category,
    image: product.image,
    price: product.price,
    mrp: product.mrp,
  };

  return (
    <div className="_container pt-6">
      <div className="bg-white p-6 rounded-lg shadow-sm max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <img src={product.image} alt={product.name} className="w-48 h-48 mx-auto object-contain" />
        </div>
        
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-bold _text-default">{product.name}</h1>
          <p className="text-sm _text-muted capitalize">{product.category}</p>
          <p className="_text-default text-sm leading-relaxed">{product.description}</p>
          
          <div className="flex items-center justify-center gap-3 py-2">
            <span className="text-xl font-semibold _text-default">₹{product.price}</span>
            {product.price < product.mrp && (
              <span className="text-sm text-gray-400 line-through">₹{product.mrp}</span>
            )}
          </div>
          
          <p className="text-xs _text-muted">Stock: {product.stock} units available</p>
          
          <div className="flex justify-center pt-4">
            <div className="w-24">
              <AddToCartButton product={cartProduct} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
