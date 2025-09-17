import React, { useState } from 'react';
import { IoAddSharp, IoRemoveSharp } from 'react-icons/io5';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { addItem, removeItem } from '../../store/cart';
import { CartProduct } from '../../utils/types';
import QuantityModal from './QuantityModal';

type ButtonProps = {
  product: CartProduct;
  size?: 'sm' | 'lg';
};
const AddToCartButton = ({ product, size }: ButtonProps) => {
  const { cartItems } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);

  const itemInCart = cartItems.filter(
    (item) => item.product.id === product.id
  )[0];
  const itemCount = itemInCart ? itemInCart.quantity : 0;

  const add = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(addItem({ product, quantity: 1 }));
  };

  const remove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(removeItem(product.id));
  };

  const handleItemAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (product.sales_prices && product.sales_prices.length > 1) {
      setShowModal(true);
    } else {
      dispatch(addItem({ product, quantity: 1 }));
    }
  };

  const handleQuantityConfirm = (quantity: number) => {
    dispatch(addItem({ product, quantity }));
  };

  return (
    <>
      {itemCount > 0 ? (
        <div
          className={`flex h-full w-full justify-around rounded-lg uppercase font-bold text-sm bg-primary cursor-pointer ${
            size === 'lg' ? 'text-lg' : 'text-normal'
          }`}
        >
          <button
            onClick={(e) => remove(e)}
            type="button"
            className="flex items-center justify-center w-8"
          >
            <IoRemoveSharp size={18} className="text-white" />
          </button>
          <span className="flex items-center justify-center text-white min-w-0">
            {itemCount}
          </span>
          <button
            onClick={(e) => add(e)}
            type="button"
            className="flex items-center justify-center w-8"
          >
            <IoAddSharp size={18} className="text-white" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          className={`_add_to_cart ${size === 'lg' ? 'text-md' : 'text-sm'}`}
          onClick={(e) => handleItemAdd(e)}
        >
          Add
        </button>
      )}
      
      <QuantityModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleQuantityConfirm}
        pricingTiers={product.sales_prices || []}
        productName={product.title}
      />
    </>
  );
};

export default AddToCartButton;
