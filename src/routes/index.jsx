import { createBrowserRouter } from 'react-router';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';

// Public Pages
import Home from '../pages/Home';
import ProductDetail from '../pages/ProductDetail';
import Categories from '../pages/Categories';
import About from '../pages/About';
import Contact from '../pages/Contact';
import FAQ from '../pages/FAQ';
import HelpCenter from '../pages/HelpCenter';
import FlashSalePage from '../pages/FlashSalePage';
import ProductsPage from '../pages/FlashSalePage';
import JustForYouPage from '../pages/FlashSalePage';

// Auth Pages
import AuthDisabled from '../pages/auth/AuthDisabled';
import AuthCallback from '../pages/auth/AuthCallback';
// Temporarily disabled due to email rate limit
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

// User Pages
import Profile from '../pages/user/Profile';
import Orders from '../pages/user/Orders';
import OrderDetail from '../pages/user/OrderDetail';
import AddReview from '../pages/user/AddReview';
import Wishlist from '../pages/user/Wishlist';
import Addresses from '../pages/user/Addresses';

// Cart & Checkout
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import PaymentSelection from '../pages/PaymentSelection';
import PaymentDetails from '../pages/PaymentDetails';
import PaymentSuccess from '../pages/PaymentSuccess';

// Admin Pages
import Dashboard from '../pages/admin/Dashboard';
import AdminProducts from '../pages/admin/products/AdminProducts';
import AddProduct from '../pages/admin/products/AddProduct';
import EditProduct from '../pages/admin/products/EditProduct';
import AdminCategories from '../pages/admin/categories/AdminCategories';
import AdminOrders from '../pages/admin/orders/AdminOrders';
import AdminOrderDetail from '../pages/admin/orders/AdminOrderDetail';
import AdminUsers from '../pages/admin/users/AdminUsers';
import AdminSettings from '../pages/admin/AdminSettings';

// Error Pages
import NotFound from '../pages/errors/NotFound';
import Unauthorized from '../pages/errors/Unauthorized';

// Route Guards
import ProtectedRoute from '../components/guards/ProtectedRoute';
import AdminRoute from '../components/guards/AdminRoute';
import GuestRoute from '../components/guards/GuestRoute';


const router = createBrowserRouter([
  // Public Routes with Main Layout
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'flash-sale',
        element: <FlashSalePage pageType="flash-sale" />,
      },
      {
        path: 'products',
        element: <ProductsPage pageType="all" />,
      },
      {
        path: 'just-for-you',
        element: <JustForYouPage pageType="just-for-you" />,
      },
      {
        path: 'product/:slug',
        element: <ProductDetail />,
      },
      {
        path: 'categories',
        element: <Categories />,
      },
      {
        path: 'categories/:slug',
        element: <FlashSalePage />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'faq',
        element: <FAQ />,
      },
      {
        path: 'help',
        element: <HelpCenter />,
      },
      {
        path: 'cart',
        element: <Cart />,
      },
      // Protected User Routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'checkout',
            element: <Checkout />,
          },
          {
            path: 'payment',
            element: <PaymentSelection />,
          },
          {
            path: 'payment-details',
            element: <PaymentDetails />,
          },
          {
            path: 'payment-success',
            element: <PaymentSuccess />,
          },
          {
            path: 'profile',
            element: <Profile />,
          },
          {
            path: 'orders',
            element: <Orders />,
          },
          {
            path: 'orders/:id',
            element: <OrderDetail />,
          },
          {
            path: 'orders/:orderId/review',
            element: <AddReview />,
          },
          {
            path: 'wishlist',
            element: <Wishlist />,
          },
          {
            path: 'addresses',
            element: <Addresses />,
          },
        ],
      },
    ],
  },
  // Auth Routes
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'callback',
        element: <AuthCallback />,
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
      },
      {
        element: <GuestRoute />,
        children: [
          {
            path: 'login',
            element: <Login />,
          },
          {
            path: 'register',
            element: <Register />,
          },
          {
            path: 'forgot-password',
            element: <ForgotPassword />,
          },
        ],
      },
    ],
  },
  // Admin Routes
  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: 'products',
            element: <AdminProducts />,
          },
          {
            path: 'products/add',
            element: <AddProduct />,
          },
          {
            path: 'products/edit/:id',
            element: <EditProduct />,
          },
          {
            path: 'categories',
            element: <AdminCategories />,
          },
          {
            path: 'orders',
            element: <AdminOrders />,
          },
          {
            path: 'orders/:id',
            element: <AdminOrderDetail />,
          },
          {
            path: 'users',
            element: <AdminUsers />,
          },
          {
            path: 'settings',
            element: <AdminSettings />,
          },
        ],
      },
    ],
  },
  // Error Routes
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
