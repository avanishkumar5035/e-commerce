import { X, CheckCircle2, Clock, Package, Truck, Home } from 'lucide-react';

const TrackingModal = ({ isOpen, onClose, order }) => {
    if (!isOpen) return null;

    const steps = [
        { id: 1, title: 'Ordered', icon: Package, status: 'completed', date: new Date(order.createdAt).toLocaleDateString() },
        { id: 2, title: 'Paid', icon: CheckCircle2, status: order.isPaid ? 'completed' : 'pending', date: order.isPaid ? new Date(order.paidAt).toLocaleDateString() : 'Pending' },
        { id: 3, title: 'Shipped', icon: Truck, status: order.isPaid ? 'completed' : 'pending', date: order.isPaid ? '24/02/2026' : 'Pending' },
        { id: 4, title: 'Out for Delivery', icon: Truck, status: order.isDelivered ? 'completed' : 'pending', date: order.isDelivered ? new Date(order.deliveredAt).toLocaleDateString() : 'Pending' },
        { id: 5, title: 'Delivered', icon: Home, status: order.isDelivered ? 'completed' : 'pending', date: order.isDelivered ? new Date(order.deliveredAt).toLocaleDateString() : 'Estimated 26/02/2026' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-deep_blue p-6 flex justify-between items-center text-white">
                    <div>
                        <h2 className="text-xl font-black">Track Package</h2>
                        <p className="text-xs text-blue-200 mt-1">Order # {order._id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8">
                    <div className="relative">
                        {/* Progress Line */}
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-100 -z-10" />

                        <div className="space-y-10">
                            {steps.map((step, index) => (
                                <div key={step.id} className="flex gap-6 items-start">
                                    <div className={`
                                        w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 bg-white transition-all duration-500
                                        ${step.status === 'completed' ? 'border-sky_blue text-sky_blue shadow-lg shadow-sky_blue/20' : 'border-gray-100 text-gray-400'}
                                    `}>
                                        <step.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className={`font-black text-sm ${step.status === 'completed' ? 'text-deep_blue' : 'text-gray-400'}`}>
                                                {step.title}
                                            </h3>
                                            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                                {step.date}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 italic">
                                            {step.status === 'completed'
                                                ? `${step.title} successfully at our fulfillment center.`
                                                : `Waiting for ${step.title.toLowerCase()} process to complete.`
                                            }
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-10 p-4 bg-bg_soft_gray rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3 text-deep_blue">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs font-black italic">Estimated arrival: Thursday, 26 February</span>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="p-6 pt-0 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-2 bg-deep_blue text-white rounded-lg font-black text-sm hover:bg-deep_blue_dark transition shadow-lg shadow-deep_blue/20"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrackingModal;
