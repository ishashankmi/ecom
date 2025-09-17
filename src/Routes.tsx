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
      <Route path="/login" element={<LoginLayout component={<Login />} />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout component={<Home />} />
        </ProtectedRoute>
      } />
      <Route
        path="/prn/:name/prid/:id"
        element={
          <ProtectedRoute>
            <Layout component={<ProductView />} />
          </ProtectedRoute>
        }
      />
      <Route path="/cart" element={
        <ProtectedRoute>
          <Layout component={<Cart />} />
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute>
          <Layout component={<Orders />} />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout component={<Profile />} />
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
        element={
          <ProtectedRoute>
            <Layout noFooter={true} component={<Error404 />} />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <Layout noFooter={true} component={<Error404 />} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppWithRouting;
