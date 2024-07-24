import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import AddProduct from './pages/AddProduct'
import Category from './pages/Category'
import AddCategory from './pages/AddCategory';
import EditProduct from './pages/EditProduct';
import ViewProduct from './pages/viewProduct';
import User from './pages/User';
import AddBlog from './pages/AddBlog';
import EditBlog from './pages/EditBlog';
import UpdateProduct from './pages/UpdateProduct';
import BannerPage from './pages/Banner';
import AddBanner from './pages/AddBanner';
import Order from './pages/Order';
import OrderView from './pages/OrderView';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> }, 
        { path: 'user', element: <User/>},
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'add-product', element: <AddProduct/> },
        { path: 'category', element: <Category/> },
        { path: 'add-category', element: <AddCategory/> },
        { path: 'add-blog', element: <AddBlog/> },
        { path: 'update-blog/:blogId', element: <EditBlog/> },
        { path: 'edit-product/:id', element: <EditProduct/> },
        { path: 'updateproduct/:id', element: <UpdateProduct/> },
        { path: 'product/:id', element: <ViewProduct/> },
        { path: 'banner', element: <BannerPage/> },
        { path: 'add-banner', element: <AddBanner/> },
        { path: 'orders', element: <Order/> },
        { path: 'order/:orderId', element: <OrderView/> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
