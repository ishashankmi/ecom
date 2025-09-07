import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks';
import { logout } from '../../store/auth';
import ProductManager from '../../components/admin/ProductManager';
import OrderManager from '../../components/admin/OrderManager';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const tabs = [
    { id: 'products', label: 'Products', component: ProductManager },
    { id: 'orders', label: 'Orders', component: OrderManager },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || ProductManager;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <button 
              onClick={() => {
                dispatch(logout());
                navigate('/login');
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
          
          <nav className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ActiveComponent />
      </div>
    </div>
  );
}