import axios from 'axios'
import Noty from 'noty'
import { initAdmin } from './admin'
import moment from 'moment'
import { status } from 'express/lib/response'

let addToCart = document.querySelectorAll('.add-to-cart')

let cartCounter = document.querySelector('#cartCounter')

function updateCart(pizza) {
    axios.post('/update-cart', pizza)
        .then((res) => {
            cartCounter.innerText = res.data.totalQty
            new Noty({
                type: 'success',
                timeout: 2000,
                text: "Item added to cart"
            }).show()
        }).catch((err) => {
            new Noty({
                type: 'error',
                timeout: 2000,
                text: "Something went wrong"
            }).show()
        })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let pizza = JSON.parse(btn.dataset.pizza)
        updateCart(pizza)
    })
})



// remove alert message after seconds
const alertMsg = document.querySelector('#success-alert')

if (alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000);
}




// change order status
let statuses = document.querySelectorAll('.status_line ')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompletd = true
    statuses.forEach((status) => {
        let dataProp = status.dataset.status
        if (stepCompletd) {
            status.classList.add('step-completed')
        }

        if (dataProp === order.status) {
            stepCompletd = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add('current')
            }

        }
    })

}

updateStatus(order)

// Socket 
let socket = io()
initAdmin(socket)
// Join
if(order){
    socket.emmit('join',`order_${order._id}`)
}

let adminAreaPath = window.location.pathname 

if (adminAreaPath.includes('admin')) {
    socket.emit('join', 'adminRoom')
}

socket.on('orderUpdated' , () => {
    const updatedOrder = {...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 2000,
        text: "Order Updated"
    }).show()
})


