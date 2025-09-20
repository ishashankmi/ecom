import { useNavigate } from 'react-router-dom';
import AddToCartButton from './shared/AddToCartButton';
import { CartProduct, ProductItem } from '../utils/types';
import { convertTextToURLSlug } from '../utils/helper';

const ProductCard = ({ product }: { product: any }) => {
  const navigate = useNavigate();
  
  if (!product) return null;
  
  // console.log('ProductCard received product:', JSON.stringify(product, null, 2));
  const { 
    id = product.product_id, 
    name = product.title, 
    price, 
    mrp, 
    image, 
    description, 
    category, 
    sales_prices 
  } = product;
  
  if (!id || !name || !price) {
    console.warn('ProductCard: Missing required fields', { id, name, price });
    return null;
  }

  const numPrice = parseFloat(price);
  const numMrp = parseFloat(mrp);

  let salesPrices;
  try {
    if (sales_prices && sales_prices.length > 0) {
      const parsed = typeof sales_prices === 'string' ? JSON.parse(sales_prices) : sales_prices;
      salesPrices = parsed.map((tier: any) => ({ 
        qty: tier.qty, 
        price: tier.price, 
        discount: tier.discount 
      }));
    } else {
      // Default discount-based pricing
      salesPrices = [
        { qty: 1, discount: 0 },
        { qty: 2, discount: numPrice * 0.1 }, // 10% discount at qty 2+
        { qty: 5, discount: numPrice * 0.2 }  // 20% discount at qty 5+
      ];
    }
  } catch (e) {
    salesPrices = [
      { qty: 1, discount: 0 },
      { qty: 2, discount: numPrice * 0.1 },
      { qty: 5, discount: numPrice * 0.2 }
    ];
  }

  const cartProduct: CartProduct = {
    id: (id || product.product_id || '').toString(),
    title: name,
    subTitle: category,
    image: image,
    price: numPrice,
    mrp: numMrp,
    sales_prices: salesPrices,
  };
  
  // console.log('CartProduct with sales_prices:', JSON.stringify(cartProduct, null, 2));
  
  // console.log('ProductCard creating cartProduct:', JSON.stringify(cartProduct, null, 2));

  const handleProductClick = () => {
    const pname = convertTextToURLSlug(name);
    navigate({
      pathname: `/prn/${pname}/prid/${id}`,
    });
  };

  return (
    <div className="_card h-[270px] w-[180px] relative flex flex-col mb-2 mx-auto sm:mx-0">
      <div 
        className="h-[154px] w-full cursor-pointer"
        onClick={handleProductClick}
      >
        <img 
          src={image && !image.startsWith('http') ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3002'}${image.startsWith('/') ? image : '/' + image}` : image || '/empty-cart.webp'} 
          alt={name} 
          className="h-full w-full p-2 object-contain"
          onError={(e) => {
            e.currentTarget.src = '/empty-cart.webp';
          }}
        />
      </div>
      <div className="overflow-hidden text-left flex flex-col flex-1 px-2 pb-2">
        <div 
          className="_text-default text-[13px] font-medium leading-tight line-clamp-2 md:line-clamp-2 truncate md:whitespace-normal mb-0.5 cursor-pointer"
          onClick={handleProductClick}
        >
          {name}
        </div>
        <div 
          className="text-sm _text-muted truncate mb-3 cursor-pointer"
          onClick={handleProductClick}
        >
          {category}
        </div>

        <div className="flex items-center justify-between mt-auto gap-2">
          <div 
            className="cursor-pointer"
            onClick={handleProductClick}
          >
            {numPrice < numMrp ? (
              <div className="flex flex-col">
                <span className="text-[14px] _text-default font-semibold leading-none">
                  ₹{numPrice}
                </span>
                <del className="text-xs text-gray-400">₹{numMrp}</del>
              </div>
            ) : (
              <div>
                <span className="text-[14px] _text-default">₹{numMrp}</span>
              </div>
            )}
          </div>
          <div className="h-9 w-[90px]">
            <AddToCartButton product={cartProduct} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
