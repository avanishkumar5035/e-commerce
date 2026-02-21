import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import { CreditCard, Truck, Smartphone } from 'lucide-react';

const Payment = () => {
    const { savePaymentMethod, paymentMethod, shippingAddress } = useContext(CartContext);
    const navigate = useNavigate();

    const [method, setMethod] = useState(paymentMethod || 'Credit Card');

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping');
        }
    }, [shippingAddress, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        savePaymentMethod(method);
        navigate('/placeorder');
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
            {/* Progress Bar */}
            <div className="flex items-center justify-center mb-12">
                <div className="flex flex-row items-center w-full max-w-md">
                    <div className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-full font-bold text-sm shadow-md">✓</div>
                    <div className="flex-1 border-b-2 border-indigo-600 mx-2"></div>
                    <div className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-full font-bold text-sm shadow-md">2</div>
                    <div className="flex-1 border-b-2 border-gray-200 mx-2"></div>
                    <div className="w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-200 text-gray-400 rounded-full font-bold text-sm">3</div>
                </div>
            </div>

            <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Payment Method</h2>
                <p className="text-gray-500 mt-2">Choose your preferred way to pay securely.</p>
            </div>

            <form onSubmit={submitHandler} className="space-y-6">
                {/* Method 1: Credit Card */}
                <label
                    className={`relative flex cursor-pointer rounded-2xl border bg-white p-6 shadow-sm focus:outline-none transition-all duration-300 ${method === 'Credit Card'
                        ? 'border-indigo-600 ring-2 ring-indigo-600 bg-indigo-50/20 shadow-md'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                        }`}
                >
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="Credit Card"
                        className="sr-only"
                        checked={method === 'Credit Card'}
                        onChange={(e) => setMethod(e.target.value)}
                    />
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${method === 'Credit Card' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Credit / Debit Card</h3>
                                <p className="text-sm text-gray-500">Secure AES-256 encrypted checkout.</p>
                            </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${method === 'Credit Card' ? 'border-indigo-600' : 'border-gray-300'}`}>
                            {method === 'Credit Card' && <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>}
                        </div>
                    </div>
                </label>

                {/* Method 2: COD */}
                <label
                    className={`relative flex cursor-pointer rounded-2xl border bg-white p-6 shadow-sm focus:outline-none transition-all duration-300 ${method === 'Pay on Delivery'
                        ? 'border-indigo-600 ring-2 ring-indigo-600 bg-indigo-50/20 shadow-md'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                        }`}
                >
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="Pay on Delivery"
                        className="sr-only"
                        checked={method === 'Pay on Delivery'}
                        onChange={(e) => setMethod(e.target.value)}
                    />
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${method === 'Pay on Delivery' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                                <Truck className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Pay on Delivery</h3>
                                <p className="text-sm text-gray-500">Pay securely in cash upon receiving.</p>
                            </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${method === 'Pay on Delivery' ? 'border-indigo-600' : 'border-gray-300'}`}>
                            {method === 'Pay on Delivery' && <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>}
                        </div>
                    </div>
                </label>

                {/* Method 3: UPI */}
                <label
                    className={`relative flex cursor-pointer rounded-2xl border bg-white p-6 shadow-sm focus:outline-none transition-all duration-300 ${method === 'UPI'
                        ? 'border-indigo-600 ring-2 ring-indigo-600 bg-indigo-50/20 shadow-md'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                        }`}
                >
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="UPI"
                        className="sr-only"
                        checked={method === 'UPI'}
                        onChange={(e) => setMethod(e.target.value)}
                    />
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${method === 'UPI' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                                <Smartphone className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">UPI (GPay, PhonePe, Paytm)</h3>
                                <p className="text-sm text-gray-500">Fast and secure payment using UPI apps.</p>
                            </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${method === 'UPI' ? 'border-indigo-600' : 'border-gray-300'}`}>
                            {method === 'UPI' && <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>}
                        </div>
                    </div>
                </label>

                <div className="pt-8 grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/shipping')}
                        className="w-full py-4 text-gray-700 bg-gray-100 rounded-xl font-bold hover:bg-gray-200 transition"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        className="w-full py-4 text-white bg-indigo-600 rounded-xl font-bold hover:bg-indigo-700 hover:-translate-y-1 hover:shadow-lg shadow-indigo-200 transition transform"
                    >
                        Continue to Checkout
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Payment;
