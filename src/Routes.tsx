import { Routes, Route } from 'react-router-dom';
import { Home, Error404 } from './pages';
import Layout from './components/Layout';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
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
      <Route path="/login" element={<LoginLayout component={<Login />} />} />
      <Route path="/signup" element={<LoginLayout component={<Login />} />} />
      <Route path="/cart" element={<Layout component={<Cart />} />} />
      <Route path="/orders" element={
        <ProtectedRoute>
          <Layout component={<Orders />} />
        </ProtectedRoute>
      } />
      <Route path="/checkout" element={
        <ProtectedRoute>
          <Layout component={<Checkout />} />
        </ProtectedRoute>
      } />
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
