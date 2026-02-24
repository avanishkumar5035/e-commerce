import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext.jsx';

const Payment = () => {
    const { shippingAddress, savePaymentMethod, paymentMethod } = useContext(CartContext);
    const [method, setMethod] = useState(paymentMethod || 'PayPal');

    const navigate = useNavigate();

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
        <div className="bg-bg_soft_gray min-h-screen">
            <div className="bg-bg_soft_gray border-b border-[#d5d9d9] py-4 px-6 mb-6">
                <div className="max-w-3xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-normal text-gray-800">Select a payment method</h1>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 pb-12">
                <div className="border border-gray-300 rounded-lg p-8">
                    <h2 className="text-xl font-black mb-6 italic text-deep_blue underline decoration-sky_blue underline-offset-4">ShopSphere <span className="text-sky_blue not-italic">Pay</span></h2>

                    <form onSubmit={submitHandler} className="space-y-6">
                        <div className="space-y-4">
                            <div className={`p-4 border rounded-lg flex items-center gap-4 cursor-pointer transition ${method === 'PayPal' ? 'border-sky_blue bg-sky_blue/5 ring-1 ring-sky_blue' : 'border-gray-200'}`}
                                onClick={() => setMethod('PayPal')}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    className="w-4 h-4 accent-deep_blue"
                                    checked={method === 'PayPal'}
                                    readOnly
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-bold">PayPal or Credit Card</p>
                                    <p className="text-xs text-gray-600">Secure payment via PayPal</p>
                                </div>
                            </div>

                            <div className={`p-4 border rounded-lg flex items-center gap-4 cursor-pointer transition ${method === 'Stripe' ? 'border-sky_blue bg-yellow-50 ring-1 ring-sky_blue' : 'border-gray-200'}`}
                                onClick={() => setMethod('Stripe')}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    className="w-4 h-4 accent-deep_blue"
                                    checked={method === 'Stripe'}
                                    readOnly
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-bold">Stripe / Credit or Debit Card</p>
                                    <p className="text-xs text-gray-600">Pay using your preferred card</p>
                                </div>
                            </div>

                            <div className={`p-4 border rounded-lg flex items-center gap-4 cursor-pointer transition ${method === 'COD' ? 'border-sky_blue bg-yellow-50 ring-1 ring-sky_blue' : 'border-gray-200'}`}
                                onClick={() => setMethod('COD')}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    className="w-4 h-4 accent-deep_blue"
                                    checked={method === 'COD'}
                                    readOnly
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-bold">Cash on Delivery (COD)</p>
                                    <p className="text-xs text-gray-600">Pay when you receive your package</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                className="bg-deep_blue text-white py-2 px-8 rounded-lg shadow-lg shadow-deep_blue/20 hover:bg-deep_blue_dark text-sm font-black transition"
                            >
                                Continue
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-8 bg-bg_soft_gray border border-gray-200 rounded p-4 text-[10px] text-gray-600">
                    <p>When you subscribe to an auto-delivery, you choose the frequency. You can cancel at any time. <span className="text-sky_blue hover:underline font-black">Learn more</span></p>
                </div>
            </div>
        </div>
    );
};

export default Payment;
