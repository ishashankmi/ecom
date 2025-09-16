import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks';
import { authAPI, ordersAPI, addressesAPI } from '../services/api';
import { logoutAsync } from '../store/auth';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [newAddress, setNewAddress] = useState({ label: '', address: '', area: '' });
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'addresses') {
      fetchAddresses();
    }
  }, [activeTab]);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await addressesAPI.getAll();
      setAddresses(response.data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    try {
      const response = await addressesAPI.create({
        address: newAddress.address,
        label: newAddress.label,
        area: newAddress.area
      });
      setAddresses([...addresses, response.data]);
      setNewAddress({ label: '', address: '', area: '' });
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await addressesAPI.delete(id);
      setAddresses(addresses.filter(addr => addr.id !== id));
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await ordersAPI.getAll();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authAPI.updateProfile(formData);
      alert('Profile updated successfully');
    } catch (error) {
      alert('Error updating profile');
    }
  };

  const handleLogout = () => {
    dispatch(logoutAsync());
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="_container pt-6 pb-8">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-4 font-medium ${
                activeTab === 'profile' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-4 font-medium ${
                activeTab === 'orders' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`px-6 py-4 font-medium ${
                activeTab === 'addresses' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
              }`}
            >
              Saved Addresses
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                  >
                    Update Profile
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
                  >
                    Logout
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Order History</h2>
              {loading ? (
                <div className="text-center py-8">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No orders found</div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">Order #{order.id}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <p className="text-lg font-bold mt-1">₹{order.total}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{order.delivery_address}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Saved Addresses</h2>
              
              <div className="mb-6 p-4 border rounded-lg">
                <h3 className="font-semibold mb-4">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Label (Home, Office, etc.)"
                    value={editingAddress ? editingAddress.label : newAddress.label}
                    onChange={(e) => editingAddress ? 
                      setEditingAddress({...editingAddress, label: e.target.value}) :
                      setNewAddress({...newAddress, label: e.target.value})
                    }
                    className="p-3 border rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Area/Locality"
                    value={editingAddress ? editingAddress.area : newAddress.area}
                    onChange={(e) => editingAddress ? 
                      setEditingAddress({...editingAddress, area: e.target.value}) :
                      setNewAddress({...newAddress, area: e.target.value})
                    }
                    className="p-3 border rounded-lg"
                  />

                  <textarea
                    placeholder="Full Address"
                    rows={3}
                    value={editingAddress ? editingAddress.address : newAddress.address}
                    onChange={(e) => editingAddress ? 
                      setEditingAddress({...editingAddress, address: e.target.value}) :
                      setNewAddress({...newAddress, address: e.target.value})
                    }
                    className="p-3 border rounded-lg"
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => {
                      if (editingAddress) {
                        setAddresses(addresses.map(addr => 
                          addr.id === editingAddress.id ? editingAddress : addr
                        ));
                        setEditingAddress(null);
                      } else {
                        handleAddAddress();
                      }
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    {editingAddress ? 'Update' : 'Add'} Address
                  </button>
                  {editingAddress && (
                    <button
                      onClick={() => setEditingAddress(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {addresses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No saved addresses</div>
                ) : (
                  addresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{address.label}</h3>
                          <p className="text-gray-600">{address.address}</p>
                          <p className="text-sm text-gray-500">{address.area}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingAddress(address)}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-red-600 hover:underline text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;