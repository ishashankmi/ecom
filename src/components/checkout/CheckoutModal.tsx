import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { createOrder } from '../../store/orders';
import { clearCart } from '../../store/cart';
import { toast } from 'react-toastify';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
  const dispatch = useAppDispatch();
  const { cartItems, billAmount } = useAppSelector(state => state.cart);
  const { user, token } = useAppSelector(state => state.auth);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!isOpen) return null;

  const handlePlaceOrder = async () => {
    if (!user || !token) {
      toast.error('Please login to place order');
      return;
    }
    
    if (!address.trim()) {
      toast.error('Please enter delivery address');
      return;
    }

    setLoading(true);
    try {
      const orderItems = cartItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.unitPrice,
        name: item.product.title,
      }));

      await dispatch(createOrder({
        items: orderItems,
        total: billAmount,
        delivery_address: address,
        payment_method: 'cod',
      })).unwrap();

      dispatch(clearCart());
      toast.success('Order placed successfully!');
      setTimeout(() => {
        setOrderPlaced(true);
      }, 100);
    } catch (error) {
      console.error('Order creation failed:', error);
      if (error?.message?.includes('Invalid token') || error?.message?.includes('token')) {
        toast.error('Please login to place order');
      } else {
        const errorMessage = error?.message || 'Failed to place order';
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOrderPlaced(false);
    setAddress('');
    onClose();
  };

  if (orderPlaced) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-sm mx-4">
          <div className="text-center">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Order Placed Successfully!</h3>
            <p className="text-gray-600 mb-4">Your order has been placed and will be delivered via Cash on Delivery (COD).</p>
            <button
              onClick={handleClose}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 w-full max-w-sm mx-auto">
        <h3 className="text-lg font-semibold mb-4">Checkout - Cash on Delivery</h3>
        
        <div className="mb-4">
          <h4 className="font-medium mb-2">Order Summary</h4>
          <div className="space-y-1 text-sm">
            {cartItems.map(item => (
              <div key={item.product.id} className="flex justify-between">
                <span>{item.product.title} x{item.quantity}</span>
                <span>₹{item.billPrice}</span>
              </div>
            ))}
            <div className="border-t pt-1 font-semibold flex justify-between">
              <span>Total</span>
              <span>₹{billAmount}</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Delivery Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your complete delivery address..."
            rows={3}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div className="mb-4 p-3 bg-blue-50 rounded">
          <p className="text-sm text-blue-800">
            <strong>Payment Method:</strong> Cash on Delivery (COD)
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation active:bg-green-800"
            type="button"
          >
            {loading ? 'Placing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;