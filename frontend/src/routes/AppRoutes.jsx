import { Routes, Route } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ProtectedRoute from '../components/ProtectedRoute';
import VendorProducts from '../pages/vendor/Products';
import CreateProduct from '../pages/vendor/CreateProduct';
import CustomerProducts from '../pages/customer/Products';
import Quotation from '../pages/customer/Quotation';
import RentalOrders from '../pages/customer/RentalOrders';
import Invoices from '../pages/customer/Invoices';
import Payments from '../pages/customer/Payments';
import ReturnPage from '../pages/customer/Return';
import Availability from '../pages/customer/Availability';


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Vendor Routes */}
      <Route
        path="/vendor/products"
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <VendorProducts />
          </ProtectedRoute>
        }
      />

      <Route
        path="/vendor/create-product"
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <CreateProduct />
          </ProtectedRoute>
        }
      />

      {/* Customer Routes */}
      <Route
        path="/products"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerProducts />
          </ProtectedRoute>
        }
      />

      <Route
        path="/quotations"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <Quotation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quotations/:id"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <Quotation />
          </ProtectedRoute>
        }
      />

      <Route
        path="/rental-orders"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <RentalOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rental-orders/:id"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <RentalOrders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/invoices"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <Invoices />
          </ProtectedRoute>
        }
      />
      <Route
        path="/invoices/:id"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <Invoices />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payments"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <Payments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payments/:invoiceId"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <Payments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/return/:rentalOrderId"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <ReturnPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/availability"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <Availability />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
