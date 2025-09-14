import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchUserOrders } from '../store/orders';

const Orders = () => {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector(state => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  if (!orders.length) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">No orders found</h2>
        <p className="text-gray-600">You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white border rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold">Order #{order.id}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                {order.status.toUpperCase()}
              </span>
            </div>
            
            <div className="mb-3">
              <h4 className="font-medium mb-2">Items:</h4>
              <div className="space-y-1">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-3 border-t">
              <div>
                <p className="text-sm text-gray-600">Delivery Address:</p>
                <p className="text-sm">{order.delivery_address}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">Total: ₹{order.total}</p>
                <p className="text-sm text-gray-600">Cash on Delivery</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;