import { useNavigate } from 'react-router-dom';
import AddToCartButton from './shared/AddToCartButton';
import { CartProduct, ProductItem } from '../utils/types';
import { convertTextToURLSlug } from '../utils/helper';

const ProductCard = ({ product }: { product: any }) => {
  const navigate = useNavigate();
  const { id, name, price, mrp, image, description, category } = product;

  const cartProduct: CartProduct = {
    id: id.toString(),
    title: name,
    subTitle: category,
    image: image,
    price,
    mrp,
  };

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
        <img src={image} alt="" className="h-full w-full p-2 object-contain" />
      </div>
      <div className="overflow-hidden text-left flex flex-col flex-1 px-2 pb-2">
        <div 
          className="_text-default text-[13px] font-medium leading-tight line-clamp-2 mb-0.5 cursor-pointer"
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
            {price < mrp ? (
              <div className="flex flex-col">
                <span className="text-[14px] _text-default font-semibold leading-none">
                  ₹{price}
                </span>
                <del className="text-xs text-gray-400">₹{mrp}</del>
              </div>
            ) : (
              <div>
                <span className="text-[14px] _text-default">₹{mrp}</span>
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
