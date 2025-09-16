import React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { addItem } from '../store/cart';
import { CartProduct } from '../utils/types';

const DynamicPricingTest = () => {
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector(state => state.cart);

  // Test product with discount-based dynamic pricing
  const testProduct: CartProduct = {
    id: 'test-1',
    title: 'Test Product with Discount-Based Pricing',
    subTitle: 'Test Category',
    image: '/uploads/placeholder.png',
    price: 100,
    mrp: 120,
    sales_prices: [
      { qty: 1, discount: 0 },
      { qty: 2, discount: 10 },
      { qty: 5, discount: 25 },
      { qty: 10, discount: 40 }
    ]
  };

  const cartItem = cartItems.find(item => item.product.id === testProduct.id);

  const handleAdd = () => {
    console.log('🧪 Test product before dispatch:', JSON.stringify(testProduct, null, 2));
    dispatch(addItem({ product: testProduct, quantity: 1 }));
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 m-4">
      <h3 className="font-bold mb-4">Dynamic Pricing Test</h3>
      
      <div className="mb-4">
        <h4 className="font-semibold">Product: {testProduct.title}</h4>
        <div className="text-sm text-gray-600">
          <div>Base Price: ₹{testProduct.price}</div>
          <div>MRP: ₹{testProduct.mrp}</div>
          <div>Discount Tiers:</div>
          <ul className="ml-4">
            {testProduct.sales_prices?.map((tier, index) => (
              <li key={index}>
                {tier.qty}+ qty: ₹{tier.discount} discount (₹{testProduct.price - (tier.discount || 0)} each)
              </li>
            ))}
          </ul>
        </div>
      </div>

      {cartItem ? (
        <div className="mb-4 p-3 bg-white rounded border">
          <h4 className="font-semibold">In Cart:</h4>
          <div>Quantity: {cartItem.quantity}</div>
          <div>Unit Price: ₹{cartItem.unitPrice}</div>
          <div>Total: ₹{cartItem.billPrice}</div>
          <div className="text-sm text-green-600">
            {cartItem.quantity >= 10 ? '₹40 discount applied (10+)!' : 
             cartItem.quantity >= 5 ? '₹25 discount applied (5+)!' : 
             cartItem.quantity >= 2 ? '₹10 discount applied (2+)!' :
             'Add more for discount'}
          </div>
        </div>
      ) : (
        <div className="mb-4 text-gray-500">Not in cart</div>
      )}

      <button
        onClick={handleAdd}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add 1 to Cart
      </button>
    </div>
  );
};

export default DynamicPricingTest;