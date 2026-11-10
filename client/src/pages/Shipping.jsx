import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sparkles, MapPin, Check, Navigation, ExternalLink, AlertCircle } from 'lucide-react';
import CartContext from '../context/CartContext.jsx';
import AuthContext from '../context/AuthContext.jsx';

const Shipping = () => {
    const { shippingAddress, saveShippingAddress } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    const [fullName, setFullName] = useState(shippingAddress.fullName || user?.name || '');
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [state, setState] = useState(shippingAddress.state || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || 'India');
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [detectingLocation, setDetectingLocation] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [locationData, setLocationData] = useState(null);
    const [selectedLocality, setSelectedLocality] = useState('');
    const [coordinates, setCoordinates] = useState(() => {
        return (shippingAddress.latitude && shippingAddress.longitude)
            ? { latitude: shippingAddress.latitude, longitude: shippingAddress.longitude, mapUrl: shippingAddress.mapUrl }
            : null;
    });

    const navigate = useNavigate();

    const fetchLocation = async (pin) => {
        if (!/^\d{6}$/.test(pin)) return;
        setLoadingLocation(true);
        try {
            const { data } = await axios.get(`/api/location/pincode/${pin}`);
            if (data && data.success) {
                setLocationData(data);
                if (data.district) setCity(data.district);
                if (data.state) setState(data.state);
                if (!country) setCountry('India');
            }
        } catch (error) {
            console.error('Failed to fetch pincode location:', error);
        } finally {
            setLoadingLocation(false);
        }
    };

    useEffect(() => {
        if (postalCode && /^\d{6}$/.test(postalCode)) {
            fetchLocation(postalCode);
        }
    }, []);

    const handlePostalCodeChange = (e) => {
        const val = e.target.value;
        setPostalCode(val);
        if (locationData && val !== locationData.pincode) {
            setLocationData(null);
            setSelectedLocality('');
        }
        if (/^\d{6}$/.test(val)) {
            fetchLocation(val);
        }
    };

    const handleUseLiveLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser.');
            return;
        }

        setDetectingLocation(true);
        setLocationError('');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const { data } = await axios.post('/api/location/reverse-geocode', { latitude, longitude });
                    if (data && data.success) {
                        setLocationData(data);
                        if (data.pincode) setPostalCode(data.pincode);
                        if (data.district || data.primaryLocation) setCity(data.district || data.primaryLocation);
                        if (data.state) setState(data.state);
                        if (data.formattedAddress) {
                            setAddress(data.formattedAddress);
                        } else if (data.primaryLocation) {
                            setAddress(`${data.primaryLocation}${data.subDistrict ? `, ${data.subDistrict}` : ''}`);
                        }
                        setCoordinates({
                            latitude: data.latitude,
                            longitude: data.longitude,
                            mapUrl: data.mapUrl
                        });
                        setCountry('India');
                    } else {
                        setLocationError('Could not fetch address for your location.');
                    }
                } catch (err) {
                    console.error('Reverse geocode error:', err);
                    setLocationError('Failed to fetch address from live location. Please enter manually.');
                } finally {
                    setDetectingLocation(false);
                }
            },
            (error) => {
                setDetectingLocation(false);
                if (error.code === error.PERMISSION_DENIED) {
                    setLocationError('Location permission was denied. Please allow location access in your browser.');
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    setLocationError('Location information is currently unavailable.');
                } else if (error.code === error.TIMEOUT) {
                    setLocationError('Location request timed out. Please try again.');
                } else {
                    setLocationError('Failed to detect current location.');
                }
            },
            { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
        );
    };

    const pickLocality = (loc) => {
        setSelectedLocality(loc);
        if (!address.trim()) {
            setAddress(loc);
        } else if (!address.toLowerCase().includes(loc.toLowerCase())) {
            setAddress(`${address}, ${loc}`);
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();
        saveShippingAddress({
            fullName,
            address,
            city,
            state,
            postalCode,
            country,
            latitude: coordinates?.latitude || null,
            longitude: coordinates?.longitude || null,
            mapUrl: coordinates?.mapUrl || null
        });
        navigate('/payment');
    };

    return (
        <div className="bg-bg_soft_gray dark:bg-slate-900 min-h-screen text-dark_charcoal dark:text-gray-100">
            <div className="bg-bg_soft_gray dark:bg-slate-900 border-b border-[#d5d9d9] dark:border-slate-700 py-4 px-6 mb-6">
                <div className="max-w-3xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-normal text-gray-800 dark:text-gray-100">Select a delivery address</h1>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 pb-12">
                <div className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg p-8 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 dark:border-slate-700 mb-6 gap-3">
                        <h2 className="text-2xl font-bold">Add delivery address</h2>
                        
                        {/* Live Location GPS Button */}
                        <button
                            type="button"
                            onClick={handleUseLiveLocation}
                            disabled={detectingLocation}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-[#E8630A] border border-orange-300 dark:border-orange-800/80 hover:bg-[#E8630A] hover:text-white transition font-bold text-xs disabled:opacity-50 cursor-pointer shadow-xs"
                        >
                            <Navigation className={`w-4 h-4 ${detectingLocation ? 'animate-spin' : ''}`} />
                            {detectingLocation ? 'Detecting Live Location...' : 'Use My Current Live Location'}
                        </button>
                    </div>

                    {locationError && (
                        <div className="mb-6 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{locationError}</span>
                        </div>
                    )}

                    {/* Coordinates / Map Pin Status Banner */}
                    {coordinates && (
                        <div className="mb-6 p-3.5 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/60 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2 text-green-800 dark:text-green-300 font-semibold">
                                <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span>
                                    Live GPS Drop Pin Attached: <span className="font-mono font-normal">({coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)})</span>
                                </span>
                            </div>
                            {coordinates.mapUrl && (
                                <a
                                    href={coordinates.mapUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-green-700 dark:text-green-400 hover:underline font-bold"
                                >
                                    <span>View Pin on Google Maps</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            )}
                        </div>
                    )}

                    <form onSubmit={submitHandler} className="space-y-6">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-bold">Country/Region</label>
                            <select
                                className="w-full border border-gray-400 dark:border-slate-600 rounded bg-bg_soft_gray dark:bg-slate-700 px-3 py-2 text-sm focus:border-sky_blue focus:ring-1 focus:ring-sky_blue outline-none text-dark_charcoal dark:text-white"
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
                                className="w-full border border-gray-400 dark:border-slate-600 rounded bg-white dark:bg-slate-700 px-3 py-2 text-sm focus:border-sky_blue focus:ring-1 focus:ring-sky_blue outline-none text-dark_charcoal dark:text-white"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>

                        {/* Pincode with Gemini Fetch */}
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold">Pincode</label>
                                {locationData?.source === 'gemini' && (
                                    <span className="text-[11px] bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                        <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-300" /> Fetched via Gemini AI
                                    </span>
                                )}
                                {locationData && locationData.source !== 'gemini' && (
                                    <span className="text-[11px] bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-0.5 rounded-full font-bold">
                                        Verified Pincode
                                    </span>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="6 digits [0-9] PIN Code (e.g. 110001 or 846004)"
                                    className="w-full border border-gray-400 dark:border-slate-600 rounded bg-white dark:bg-slate-700 px-3 py-2 text-sm focus:border-sky_blue focus:ring-1 focus:ring-sky_blue outline-none text-dark_charcoal dark:text-white"
                                    value={postalCode}
                                    maxLength={6}
                                    onChange={handlePostalCodeChange}
                                    required
                                />
                                {loadingLocation && (
                                    <div className="absolute right-3 top-2.5">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-sky_blue border-t-transparent" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Localities & Villages under this PIN code */}
                        {locationData && locationData.localities && locationData.localities.length > 0 && (
                            <div className="p-4 bg-sky-50 dark:bg-slate-700/50 border border-sky-200 dark:border-slate-600 rounded-lg">
                                <p className="text-xs font-bold text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                                    Small Places & Villages under {locationData.pincode} (Click to add to Address):
                                </p>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-2">
                                    Tap your village, ward or mohalla to automatically include it in your address:
                                </p>
                                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                                    {locationData.localities.map((loc, idx) => {
                                        const isSelected = selectedLocality === loc || address.toLowerCase().includes(loc.toLowerCase());
                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => pickLocality(loc)}
                                                className={`text-xs px-2.5 py-1 rounded-md border transition font-medium flex items-center gap-1 cursor-pointer ${
                                                    isSelected
                                                        ? 'bg-sky-600 text-white border-sky-600'
                                                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-slate-600 hover:border-sky-500'
                                                }`}
                                            >
                                                {isSelected && <Check className="w-3 h-3" />}
                                                {loc}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-bold">Flat, House no., Building, Company, Apartment, Village</label>
                            <input
                                type="text"
                                placeholder="Street address, Village name, P.O. box, Landmark"
                                className="w-full border border-gray-400 dark:border-slate-600 rounded bg-white dark:bg-slate-700 px-3 py-2 text-sm focus:border-sky_blue focus:ring-1 focus:ring-sky_blue outline-none text-dark_charcoal dark:text-white"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-bold">City / District</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-400 dark:border-slate-600 rounded bg-white dark:bg-slate-700 px-3 py-2 text-sm focus:border-sky_blue focus:ring-1 focus:ring-sky_blue outline-none text-dark_charcoal dark:text-white"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-bold">State</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Bihar, Uttar Pradesh, Maharashtra"
                                    className="w-full border border-gray-400 dark:border-slate-600 rounded bg-white dark:bg-slate-700 px-3 py-2 text-sm focus:border-sky_blue focus:ring-1 focus:ring-sky_blue outline-none text-dark_charcoal dark:text-white"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="bg-deep_blue text-white py-2.5 px-8 rounded-lg shadow-lg shadow-deep_blue/20 hover:bg-deep_blue_dark text-sm font-black transition cursor-pointer"
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
