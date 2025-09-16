import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks';
import { addItem, removeItem } from '../store/cart';
import { FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import DynamicPricingPopup from '../components/DynamicPricingPopup';

export default function Cart() {
  const dispatch = useAppDispatch();
  const { cartItems, totalQuantity, billAmount, totalAmount, discount } = useAppSelector(state => state.cart);
  const { user } = useAppSelector(state => state.auth);
  
  // console.log('Cart items:', cartItems);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <img 
            src="/empty-cart.webp" 
            alt="Empty cart" 
            className="w-32 h-32 mx-auto mb-4 opacity-50"
          />
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-700">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some items to get started</p>
          <Link 
            to="/" 
            className="inline-block text-white px-6 py-3 rounded-lg hover:opacity-90 transition-colors font-medium"
            style={{backgroundColor: '#0041C2'}}
          >
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
                src={item.product.image && !item.product.image.startsWith('http') ? 
                  `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3002'}${item.product.image.startsWith('/') ? item.product.image : '/' + item.product.image}` : 
                  item.product.image || '/empty-cart.webp'} 
                alt={item.product.title}
                className="w-16 h-16 object-cover rounded-lg mr-4 bg-gray-100"
                onError={(e) => {
                  // console.log('Image failed to load:', e.currentTarget.src);
                  e.currentTarget.src = '/empty-cart.webp';
                }}
              />
              
              <div className="flex-1">
                <h3 className="font-medium">{item.product.title}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-primary font-bold">₹{item.unitPrice}</p>
                  {item.unitPrice < item.product.mrp && (
                    <p className="text-gray-400 line-through text-sm">₹{item.product.mrp}</p>
                  )}
                </div>
                <p className="text-sm text-gray-600">Total: ₹{item.billPrice}</p>
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
                  onClick={() => dispatch(addItem({ product: item.product, quantity: 1 }))}
                  className="p-2 text-primary"
                >
                  <FiPlus size={16} />
                </button>
                
                <button
                  onClick={() => {
                    // Remove all quantities of this item
                    for (let i = 0; i < item.quantity; i++) {
                      dispatch(removeItem(item.product.id));
                    }
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  title="Remove from cart"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="space-y-3 mb-4">
            {cartItems.map(item => (
              <div key={item.product.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div className="flex-1">
                  <div className="font-medium">{item.product.title}</div>
                  <div className="text-sm text-gray-600">Qty: {item.quantity} × ₹{item.unitPrice}</div>
                </div>
                <div className="flex items-center gap-3">
                  <DynamicPricingPopup product={{
                    id: item.product.id,
                    title: item.product.title,
                    price: item.product.price
                  }} />
                  <span className="font-semibold">₹{item.billPrice}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2 mb-4 border-t pt-4">
            <div className="flex justify-between">
              <span>Subtotal ({totalQuantity} items)</span>
              <span>₹{totalAmount}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between" style={{color: '#0041C2'}}>
                <span>Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
              <span>Total</span>
              <span>₹{billAmount}</span>
            </div>
          </div>
          
          {user ? (
            <Link
              to="/checkout"
              className="w-full text-white py-3 rounded-lg text-center block hover:opacity-90 transition-colors font-medium"
              style={{backgroundColor: '#0041C2'}}
            >
              Proceed to Checkout
            </Link>
          ) : (
            <Link
              to="/login"
              className="w-full text-white py-3 rounded-lg text-center block hover:opacity-90 transition-colors font-medium"
              style={{backgroundColor: '#0041C2'}}
            >
              Login to Checkout
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}