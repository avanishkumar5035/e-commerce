import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Package, Plus, Edit, Trash2 } from 'lucide-react';

const ProductListAdmin = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/products');
            setProducts(data.products || data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
        } else {
            fetchProducts();
        }
    }, [user, navigate]);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                await axios.delete(`/api/products/${id}`, config);
                addToast('Product deleted successfully', 'success');
                fetchProducts();
            } catch (error) {
                console.error(error);
                addToast('Error deleting product', 'error');
            }
        }
    };

    const createProductHandler = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post('/api/products', {}, config);
            addToast('Draft product created', 'success');
            navigate(`/admin/product/${data._id}/edit`);
        } catch (error) {
            console.error(error);
            addToast('Error creating product', 'error');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-deep_blue"></div>
        </div>
    );

    return (
        <div className="text-dark_charcoal">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-dark_charcoal tracking-tight">Products Catalog</h1>
                    <p className="text-text_secondary font-medium">Manage all products in your store</p>
                </div>
                <button
                    onClick={createProductHandler}
                    className="flex items-center gap-2 bg-deep_blue text-white px-8 py-3.5 rounded-2xl font-black hover:bg-deep_blue_dark hover:-translate-y-1 hover:shadow-2xl shadow-xl shadow-deep_blue/30 transition transform active:scale-95"
                >
                    <Plus className="w-5 h-5" /> Add New Product
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Brand</th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{product._id.substring(0, 8)}...</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sky_blue font-black">₹{product.price.toLocaleString('en-IN')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">{product.category}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.brand}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link to={`/admin/product/${product._id}/edit`} className="text-white bg-deep_blue p-2.5 rounded-xl hover:bg-deep_blue_dark transition shadow-lg shadow-deep_blue/10">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button onClick={() => deleteHandler(product._id)} className="text-red-700 hover:text-white bg-red-50 p-2 rounded-lg hover:bg-red-700 transition shadow-sm border border-red-100">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {products.length === 0 && (
                    <div className="text-center py-12 text-gray-500">No products found. Start by adding one.</div>
                )}
            </div>
        </div>
    );
};

export default ProductListAdmin;
