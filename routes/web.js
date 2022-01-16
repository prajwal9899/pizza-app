const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const guest = require('../app/http/middlewares/guest')
const orderController = require('../app/http/controllers/customers/orderController')
const AdminOrderController = require('../app/http/controllers/admin/orderController')
const auth = require('../app/http/middlewares/auth')
const admin = require('../app/http/middlewares/admin')
const statusController = require('../app/http/controllers/admin/statusController')

function initRoutes(app) {


    app.get('/', homeController().index)

    app.get('/login',guest, authController().login)

    app.post('/login', authController().postLogin)

    app.get('/register', authController().register)

    app.post('/register',guest, authController().postRegister)

    app.post('/logout', authController().logout)

    app.get('/cart', cartController().index)

    app.post('/update-cart', cartController().update)



    // customer routes

    app.post('/orders',auth, orderController().store )

    app.get('/customer/orders',auth, orderController().index)

    app.get('/customer/orders/:id',auth, orderController().show)

    
    // Admin routes

    app.get('/admin/orders',admin,AdminOrderController().index)

    app.post('/admin/order/status',admin,statusController().update)


}


module.exports = initRoutes