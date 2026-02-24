import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Shipping from './pages/Shipping';
import Payment from './pages/Payment';
import PlaceOrder from './pages/PlaceOrder';
import CustomerService from './pages/CustomerService';
import Order from './pages/Order';
import MyOrders from './pages/MyOrders';
import Wishlist from './pages/Wishlist';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProductListAdmin from './pages/admin/ProductListAdmin';
import OrderListAdmin from './pages/admin/OrderListAdmin';
import ActivityLogAdmin from './pages/admin/ActivityLogAdmin';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import UserListAdmin from './pages/admin/UserListAdmin';
import MonitorAdmin from './pages/admin/MonitorAdmin';
import AdminLayout from './components/AdminLayout';

// Layout for customer-facing pages
const MainLayout = () => (
    <div className="min-h-screen bg-bg_cool_gray font-sans flex flex-col transition-colors duration-300">
        <Header />
        <main className="flex-1">
            <Outlet />
        </main>
        <Footer />
    </div>
);

function App() {
    return (
        <Router>
            <Routes>
                {/* Main Routes */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/shipping" element={<Shipping />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/placeorder" element={<PlaceOrder />} />
                    <Route path="/customer-service" element={<CustomerService />} />
                    <Route path="/myorders" element={<MyOrders />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/order/:id" element={<Order />} />
                    <Route path="/forgotpassword" element={<ForgotPassword />} />
                    <Route path="/resetpassword/:token" element={<ResetPassword />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="dashboard" element={<DashboardAdmin />} />
                    <Route path="products" element={<ProductListAdmin />} />
                    <Route path="orders" element={<OrderListAdmin />} />
                    <Route path="users" element={<UserListAdmin />} />
                    <Route path="activities" element={<ActivityLogAdmin />} />
                    <Route path="monitor" element={<MonitorAdmin />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
