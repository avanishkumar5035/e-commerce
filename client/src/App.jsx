import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import ProductListAdmin from './pages/admin/ProductListAdmin';
import OrderListAdmin from './pages/admin/OrderListAdmin';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-bg_light font-sans flex flex-col">
                <Header />
                <main className="flex-1">
                    <Routes>
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
                        <Route path="/order/:id" element={<Order />} />
                        <Route path="/admin/products" element={<ProductListAdmin />} />
                        <Route path="/admin/orders" element={<OrderListAdmin />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
