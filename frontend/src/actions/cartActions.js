import axios from 'axios'
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS,
} from '../constants/cartConstants'

const host =
  process.env.NODE_ENV === 'production'
    ? 'https://cyber-store-five.vercel.app'
    : 'http://localhost:5000'

//const host = 'http://localhost:5000'

export const addToCart = (id, qty) => async (dispatch, getState) => {
  const res = await axios.get(`${host}/api/products/${id}`)

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: res.data._id,
      name: res.data.name,
      image: res.data.image,
      price: res.data.price,
      countInStock: res.data.countInStock,
      qty: qty,
    },
  })

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  })

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  })

  localStorage.setItem('shippingAddress', JSON.stringify(data))
}
export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  })

  localStorage.setItem('paymentMethod', JSON.stringify(data))
}
