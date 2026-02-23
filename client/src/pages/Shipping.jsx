import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext.jsx';

const Shipping = () => {
    const { shippingAddress, saveShippingAddress } = useContext(CartContext);

    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');

    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        saveShippingAddress({ address, city, postalCode, country });
        navigate('/payment');
    };

    return (
        <div className="bg-bg_light min-h-screen">
            <div className="bg-bg_light border-b border-[#d5d9d9] py-4 px-6 mb-6">
                <div className="max-w-3xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-normal text-gray-800">Select a delivery address</h1>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 pb-12">
                <div className="border border-gray-300 rounded-lg p-8">
                    <h2 className="text-2xl font-bold mb-6">Add a new address</h2>

                    <form onSubmit={submitHandler} className="space-y-6">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-bold">Country/Region</label>
                            <select
                                className="w-full border border-gray-400 rounded bg-bg_light px-2 py-2 text-sm focus:border-accent_gold focus:ring-1 focus:ring-accent_gold outline-none"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                required
                            >
                                <option value="">Select Country</option>
                                <option value="India">India</option>
                                <option value="United States">United States</option>
                                <option value="United Kingdom">United Kingdom</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-bold">Full name (First and Last name)</label>
                            <input
                                type="text"
                                className="w-full border border-gray-400 rounded px-2 py-2 text-sm focus:border-accent_gold focus:ring-1 focus:ring-accent_gold outline-none"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-bold">Address</label>
                            <input
                                type="text"
                                placeholder="Street address, P.O. box, company name, c/o"
                                className="w-full border border-gray-400 rounded px-2 py-2 text-sm focus:border-accent_gold focus:ring-1 focus:ring-accent_gold outline-none mb-2"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-bold">City</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-400 rounded px-2 py-2 text-sm focus:border-accent_gold focus:ring-1 focus:ring-accent_gold outline-none"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-bold">Pincode</label>
                                <input
                                    type="text"
                                    placeholder="6 digits [0-9] PIN Code"
                                    className="w-full border border-gray-400 rounded px-2 py-2 text-sm focus:border-accent_gold focus:ring-1 focus:ring-accent_gold outline-none"
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="bg-accent_gold py-2 px-6 rounded-lg shadow-sm border border-[#a88734] hover:bg-[#f3a847] text-sm font-bold transition"
                            >
                                Use this address
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Shipping;
