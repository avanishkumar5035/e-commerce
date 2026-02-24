const Order = require('../models/Order');
const Activity = require('../models/Activity');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400).json({ message: 'No order items' });
            return;
        } else {
            const order = new Order({
                orderItems,
                user: req.user._id,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
            });

            const createdOrder = await order.save();

            await Activity.create({
                user: req.user._id,
                userName: req.user.name,
                action: 'PURCHASE',
                details: `Order created: ${createdOrder._id}`,
                payload: { orderId: createdOrder._id, amount: createdOrder.totalPrice },
            });

            res.status(201).json(createdOrder);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id || 'SIMULATED_ID',
                status: req.body.status || 'COMPLETED',
                update_time: req.body.update_time || new Date().toISOString(),
                email_address: req.body.email_address || req.user.email,
            };

            const updatedOrder = await order.save();

            await Activity.create({
                user: req.user._id,
                userName: req.user.name,
                action: 'PAYMENT',
                details: `Order paid: ${updatedOrder._id}`,
                payload: { orderId: updatedOrder._id, amount: updatedOrder.totalPrice },
            });

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Request a return
// @route   PUT /api/orders/:id/return
// @access  Private
const requestReturn = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            if (!order.isDelivered) {
                return res.status(400).json({ message: 'Only delivered orders can be returned' });
            }

            order.isReturned = true;
            order.returnReason = req.body.reason;
            order.returnStatus = 'Pending';
            order.returnedAt = Date.now();

            const updatedOrder = await order.save();

            await Activity.create({
                user: req.user._id,
                userName: req.user.name,
                action: 'RETURN_REQUEST',
                details: `Return requested for order: ${updatedOrder._id}`,
                payload: { orderId: updatedOrder._id, reason: req.body.reason },
            });

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update return status
// @route   PUT /api/orders/:id/return-status
// @access  Private/Admin
const updateReturnStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.returnStatus = req.body.status;
            if (req.body.status === 'Completed') {
                // Logic for refund could go here
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders,
    getMyOrders,
    requestReturn,
    updateReturnStatus,
};
