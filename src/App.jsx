import { Navigate, Route, Routes } from 'react-router-dom';
import { SiteLayout, DashboardLayout } from './components/Layout.jsx';
import { RequireAuth } from './components/common.jsx';
import { Home, Storefront, ProductDetail, Cart, Checkout, OrderStatus } from './pages/Pages.jsx';
import { AuthPage, ForgotPassword, SetupStore } from './pages/AuthPages.jsx';
import { Account, Admin } from './pages/Account.jsx';
import { Analytics, Customers, DashboardData, Inventory, Orders, Overview, Products, StoreSettings } from './pages/Dashboard.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout/>}>
        <Route path="/" element={<Home/>}/>
        <Route path="/store/:storeSlug" element={<Storefront/>}/>
        <Route path="/store/:storeSlug/product/:productId" element={<ProductDetail/>}/>
        <Route path="/store/:storeSlug/cart" element={<Cart/>}/>
        <Route path="/store/:storeSlug/checkout" element={<Checkout/>}/>
        <Route path="/order/:orderId" element={<OrderStatus/>}/>
        <Route path="/signup" element={<AuthPage mode="signup"/>}/>
        <Route path="/login" element={<AuthPage/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/setup-store" element={<SetupStore/>}/>
        <Route path="/account" element={<Account/>}/>
        <Route path="/admin" element={<Admin/>}/>
      </Route>
      <Route path="/dashboard" element={<RequireAuth role="seller"><DashboardData><DashboardLayout/></DashboardData></RequireAuth>}>
        <Route index element={<Overview/>}/>
        <Route path="products" element={<Products/>}/>
        <Route path="orders" element={<Orders/>}/>
        <Route path="inventory" element={<Inventory/>}/>
        <Route path="customers" element={<Customers/>}/>
        <Route path="analytics" element={<Analytics/>}/>
        <Route path="settings" element={<StoreSettings/>}/>
      </Route>
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
  );
}
