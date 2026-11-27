import { Route, Routes } from 'react-router';
import LoginPage from '../pages/LoginPage';
import ProductsPage from '../pages/ProductsPage';
import OrdersPage from '../pages/OrdersPage';
import CategoriesPage from '../pages/CategoriesPage';
import UsersPage from '../pages/UsersPage';
import AdminRoute from './AdminRoute';
import DashboardLayout from '../components/layout/DashboardLayout';

// مؤقت لحد ما نبني الصفحات الحقيقية
const Placeholder = ({ title }: { title: string }) => (
  <h1 className="text-2xl font-semibold">{title}</h1>
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<AdminRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Placeholder title="Overview" />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
