import { Routes, Route } from 'react-router-dom';
import { Home, Error404 } from './pages';
import Layout from './components/Layout';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import LoginLayout from './components/LoginLayout';
import Search from './pages/Search';
import ProductView from './pages/ProductView';

const AppWithRouting = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout component={<Home />} />} />
      <Route path="/search" element={<Layout component={<Search />} />} />
      <Route
        path="/prn/:name/prid/:id"
        element={<Layout component={<ProductView />} />}
      />
      <Route path="/cart" element={<Layout component={<Cart />} />} />
      <Route path="/orders" element={<Layout component={<Orders />} />} />
      <Route path="/profile" element={<Layout component={<Profile />} />} />
      <Route path="/checkout" element={<Layout component={<Checkout />} />} />
      <Route path="/admin" element={
        <ProtectedRoute adminOnly>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route
        path="/not-found"
        element={<Layout noFooter={true} component={<Error404 />} />}
      />
      <Route
        path="*"
        element={<Layout noFooter={true} component={<Error404 />} />}
      />
    </Routes>
  );
};

export default AppWithRouting;
