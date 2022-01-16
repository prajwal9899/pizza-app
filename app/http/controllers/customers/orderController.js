const Order = require('../../../models/order')
const moment = require('moment')

function orderController() {
    return {
        store(req, res) {
            const { phone, address } = req.body
            // validate request
            if (!phone || !address) {
                req.flash('error', 'All fields are required')
                return res.redirect('/cart')
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            })

            order.save().then((result) => {
                Order.populate(result, { path: 'customerId' }, (err, placedOrder) => {
                    req.flash('success', 'Order placed successfully')
                    delete req.session.cart

                    // Emit 
                    const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('orderPlaced', placedOrder)
                    return res.redirect('/customer/orders')
                })
            }).catch((err) => {
                req.flash('error', 'something went wrong')
                return res.redirect('/cart')
            })
        },
        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id },
                null,
                { sort: { 'createdAt': -1 } })
            res.header()
            res.render('customers/orders', { orders: orders, moment: moment })
        },
        async show(req, res) {
            const order = await Order.findById(req.params.id)

            // authorize user 
            if (req.user._id.toString() === order.customerId.toString()) {
                res.render('customers/singleOrders', { order })
            }

            return res.redirect('/')


        }
    }
}

module.exports = orderController