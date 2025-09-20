import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { createOrder } from '../../store/orders';
import { clearCart } from '../../store/cart';
import { addressesAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function CheckoutForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { cartItems, billAmount } = useAppSelector(state => state.cart);
  const { loading } = useAppSelector(state => state.orders);
  const { user, token } = useAppSelector(state => state.auth);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [codAccepted, setCodAccepted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await addressesAPI.getAll();
      setAddresses(response.data);
      if (response.data.length > 0) {
        setSelectedAddressId(response.data[0].id.toString());
      } else {
        setUseNewAddress(true);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setUseNewAddress(true);
    }
  };

  const handlePlaceOrder = async () => {
    console.log('Place Order clicked!');
    setError('');

    if (!user || !token) {
      setError('Please login to place an order.');
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    let deliveryAddress = '';
    if (useNewAddress) {
      if (!newAddress || newAddress.length < 10) {
        setError('Please enter a valid address (minimum 10 characters).');
        return;
      }
      deliveryAddress = newAddress;
    } else {
      const selectedAddr = addresses.find(addr => addr.id.toString() === selectedAddressId);
      if (!selectedAddr) {
        setError('Please select a valid address.');
        return;
      }
      deliveryAddress = `${selectedAddr.address}, ${selectedAddr.area}`;
    }

    try {
      const orderItems = cartItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.unitPrice,
        name: item.product.title,
      }));

      console.log('Dispatching order:', {
        items: orderItems,
        total: billAmount,
        delivery_address: deliveryAddress,
        payment_method: 'cod',
      });

      const result = await dispatch(createOrder({
        items: orderItems,
        total: billAmount,
        delivery_address: deliveryAddress,
        payment_method: 'cod',
      }));

      console.log('Order result:', result);

      if (createOrder.fulfilled.match(result)) {
        console.log('Order successful, clearing cart');
        dispatch(clearCart());
        navigate('/orders');
      } else {
        setError('Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error('Order error:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Delivery Address</label>
          
          {addresses.length > 0 && (
            <div className="mb-4">
              <div className="flex gap-4 mb-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!useNewAddress}
                    onChange={() => setUseNewAddress(false)}
                    className="mr-2"
                  />
                  Select Saved Address
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={useNewAddress}
                    onChange={() => setUseNewAddress(true)}
                    className="mr-2"
                  />
                  Enter New Address
                </label>
              </div>
              
              {!useNewAddress && (
                <select
                  value={selectedAddressId}
                  onChange={(e) => setSelectedAddressId(e.target.value)}
                  className="w-full p-3 border rounded-lg mb-3"
                >
                  {addresses.map(address => (
                    <option key={address.id} value={address.id}>
                      {address.label} - {address.area}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
          
          {(useNewAddress || addresses.length === 0) && (
            <textarea
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              rows={3}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your complete address"
            />
          )}
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={codAccepted}
              onChange={(e) => setCodAccepted(e.target.checked)}
              className="mr-2"
            />
            Cash on Delivery (COD)
          </label>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Total: ₹{billAmount}</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button
          onClick={handlePlaceOrder}
          disabled={loading || !codAccepted}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Placing Order...' : !codAccepted ? 'Select Payment Method' : 'Place Order'}
        </button>
      </div>
    </div>
  );
}