import { Route, Routes, Navigate } from 'react-router';
import Layout from '../layout/Layout';
import Home from '../pages/Home';
import ProductsPage from '../pages/ProductsPage';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProductDetailsPage from '../pages/ProductDetailsPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import AccountPage from '../pages/AccountPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import NotFoundPage from '../pages/NotFoundPage';
import WishlistPage from '../pages/WishlistPage';
import CategoriesSection from '../components/Home/CategoriesSection';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<ProductsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/categories" element={<CategoriesSection />} />
        <Route path="/new-arrivals" element={<Navigate to="/shop?sort=newest" replace />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        {/* ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
