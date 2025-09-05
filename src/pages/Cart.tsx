import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks';
import { addItem, removeItem } from '../store/cart';
import { FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';

export default function Cart() {
  const dispatch = useAppDispatch();
  const { cartItems, totalQuantity, billAmount } = useAppSelector(state => state.cart);

  if (cartItems.length === 0) {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Link to="/" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
        
        <div className="space-y-4 mb-6">
          {cartItems.map(item => (
            <div key={item.product.id} className="bg-white p-4 rounded-lg shadow-sm flex items-center">
              <img 
                src={item.product.image} 
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded-lg mr-4"
              />
              
              <div className="flex-1">
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-primary font-bold">₹{item.product.price}</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => dispatch(removeItem(item.product.id))}
                  className="p-2 text-red-500"
                >
                  <FiMinus size={16} />
                </button>
                
                <span className="font-medium">{item.quantity}</span>
                
                <button
                  onClick={() => dispatch(addItem(item.product))}
                  className="p-2 text-primary"
                >
                  <FiPlus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-bold">Total: ₹{billAmount}</span>
            <span className="text-sm text-gray-600">{totalQuantity} items</span>
          </div>
          
          <Link
            to="/checkout"
            className="w-full bg-primary text-white py-3 rounded-lg text-center block hover:bg-primary-dark transition-colors"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}