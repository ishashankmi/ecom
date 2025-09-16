import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../hooks';
import { productsAPI } from '../services/api';
import AddToCartButton from '../components/shared/AddToCartButton';
import ProductCard from '../components/ProductCard';

const ProductView = () => {
  const { id } = useParams();
  const { products } = useAppSelector(state => state.products);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const productFromStore = products.find(p => p.id.toString() === id);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (productFromStore) {
      setProduct(productFromStore);
      setLoading(false);
    } else if (id) {
      setLoading(true);
      productsAPI.getById(id)
        .then(response => {
          setProduct(response.data);
          setLoading(false);
        })
        .catch(() => {
          setProduct(null);
          setLoading(false);
        });
    }
  }, [id, productFromStore]);

  useEffect(() => {
    if (product?.category && id) {
      setLoadingSimilar(true);
      productsAPI.getSimilar(product.category, id)
        .then(response => setSimilarProducts(response.data.slice(0, 8)))
        .catch(() => setSimilarProducts([]))
        .finally(() => setLoadingSimilar(false));
    }
  }, [id, product?.category]);

  if (loading) {
    return <div className="text-center py-8">Loading product...</div>;
  }

  if (!product) {
    return <div className="text-center py-8">Product not found</div>;
  }

  const getProductImages = () => {
    const images = [];
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      images.push(...product.images);
    } else if (product.image) {
      images.push(product.image);
    } else {
      images.push('/uploads/placeholder.png');
    }
    return images;
  };

  const getCurrentImage = () => {
    const images = getProductImages();
    return images[selectedImageIndex] || images[0];
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001'}/uploads/placeholder.png`;
    if (imagePath.startsWith('http')) return imagePath;
    return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001'}${imagePath}`;
  };

  const cartProduct = {
    id: product.id.toString(),
    title: product.name,
    subTitle: product.category,
    image: getCurrentImage(),
    price: product.price,
    mrp: product.mrp,
  };

  return (
    <div className="_container pt-6 pb-8">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Left side - Product Images */}
          <div className="space-y-4">
            <div className="h-80 bg-gray-50 rounded-lg overflow-hidden">
              <img 
                src={getImageUrl(getCurrentImage())} 
                alt={product.name} 
                className="w-full h-full object-contain p-4" 
              />
            </div>
            
            {/* Image thumbnails */}
            {getProductImages().length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {getProductImages().map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img 
                      src={getImageUrl(image)} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>
            )}
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
              
              {/* Dynamic Pricing */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 md:p-4">
                <h4 className="font-semibold text-green-800 mb-2 text-sm md:text-base">Bulk Discounts</h4>
                <div className="space-y-1 text-xs md:text-sm">
                  <div className="flex justify-between items-center">
                    <span className="flex-shrink-0">Buy 2+:</span>
                    <span className="font-medium text-green-700 text-right">₹{Math.round(product.price * 0.9)} (₹{Math.round(product.price * 0.1)} off)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex-shrink-0">Buy 5+:</span>
                    <span className="font-medium text-green-700 text-right">₹{Math.round(product.price * 0.8)} (₹{Math.round(product.price * 0.2)} off)</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-semibold _text-default mb-2">Product Details</h3>
                <p className="_text-default text-sm leading-normal">{product.description}</p>
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
      <div className="mt-12">
        <h2 className="text-2xl font-bold _text-default mb-6">Similar Products</h2>
        {loadingSimilar ? (
          <div className="text-center py-8">Loading similar products...</div>
        ) : similarProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {similarProducts.map((similarProduct) => (
              <ProductCard key={similarProduct.id} product={similarProduct} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No similar products found</div>
        )}
      </div>
    </div>
  );
};

export default ProductView;
