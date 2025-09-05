import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { productsAPI } from '../services/api';
import AddToCartButton from '../components/shared/AddToCartButton';
import ProductCard from '../components/ProductCard';

const ProductView = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await productsAPI.getById(id!);
        setProduct(response.data);
        
        // Fetch similar products
        try {
          const similarResponse = await productsAPI.getSimilar(response.data.category, id!);
          setSimilarProducts(similarResponse.data.slice(0, 8));
        } catch (error) {
          // Fallback: get all products and filter by category
          const allResponse = await productsAPI.getAll();
          const filtered = allResponse.data
            .filter((p: any) => p.category === response.data.category && p.id.toString() !== id)
            .slice(0, 8);
          setSimilarProducts(filtered);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProduct();
      // Scroll to top when product changes
      window.scrollTo(0, 0);
    }
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
    <div className="_container pt-6 pb-8">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Left side - Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain p-4" 
              />
            </div>
            {/* Additional product images could go here */}
          </div>
          
          {/* Right side - Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold _text-default mb-2">{product.name}</h1>
              <p className="text-sm _text-muted capitalize bg-gray-100 px-3 py-1 rounded-full inline-block">
                {product.category}
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">₹{product.price}</span>
                {product.price < product.mrp && (
                  <span className="text-lg text-gray-400 line-through">₹{product.mrp}</span>
                )}
                {product.price < product.mrp && (
                  <span className="text-sm bg-blue-100 text-primary px-2 py-1 rounded">
                    {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                  </span>
                )}
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-semibold _text-default mb-2">Product Details</h3>
                <p className="_text-default leading-relaxed">{product.description}</p>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="_text-muted">Stock:</span>
                <span className={`font-medium ${
                  product.stock > 10 ? 'text-primary' : 
                  product.stock > 0 ? 'text-orange-600' : 'text-red-600'
                }`}>
                  {product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}
                </span>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <div className="flex items-center gap-4">
                <div className="w-32">
                  <AddToCartButton product={cartProduct} />
                </div>
                <div className="text-sm _text-muted">
                  <p>Free delivery on orders above ₹199</p>
                  <p>Delivery in 10-15 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold _text-default mb-6">Similar Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {similarProducts.map((similarProduct) => (
              <ProductCard key={similarProduct.id} product={similarProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductView;
