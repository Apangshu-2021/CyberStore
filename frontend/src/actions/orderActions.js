import {
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_DELIVER_FAIL,
  ORDER_DELIVER_REQUEST,
  ORDER_DELIVER_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_LIST_MY_FAIL,
  ORDER_LIST_MY_REQUEST,
  ORDER_LIST_MY_SUCCESS,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
} from '../constants/orderConstants'
import { logout } from './userActions'
import axios from 'axios'
import { CART_CLEAR_ITEMS } from '../constants/cartConstants'

const host =
  process.env.NODE_ENV === 'production'
    ? 'https://cyber-store-five.vercel.app'
    : 'http://localhost:5000'

//const host = 'http://localhost:5000'

export const createdOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_CREATE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const res = await axios.post(`${host}/api/orders`, order, config)

    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: res.data,
    })

    dispatch({
      type: CART_CLEAR_ITEMS,
      payload: res.data,
    })

    localStorage.removeItem('cartItems')
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message

    if (message === 'Not Authorized,token failed') {
      dispatch(logout())
    }
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload: message,
    })
  }
}

export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_DETAILS_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const res = await axios.get(`${host}/api/orders/${id}`, config)

    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: res.data,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message

    if (message === 'Not Authorized,token failed') {
      dispatch(logout())
    }
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload: message,
    })
  }
}

export const payOrder = (id, paymentResult) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_PAY_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const res = await axios.put(
      `${host}/api/orders/${id}/pay`,
      paymentResult,
      config
    )

    dispatch({
      type: ORDER_PAY_SUCCESS,
      payload: res.data,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message

    if (message === 'Not Authorized,token failed') {
      dispatch(logout())
    }
    dispatch({
      type: ORDER_PAY_FAIL,
      payload: message,
    })
  }
}

export const listMyOrders = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_LIST_MY_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const res = await axios.get(`${host}/api/orders/myorders`, config)

    dispatch({
      type: ORDER_LIST_MY_SUCCESS,
      payload: res.data,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message

    if (message === 'Not Authorized,token failed') {
      dispatch(logout())
    }
    dispatch({
      type: ORDER_LIST_MY_FAIL,
      payload: message,
    })
  }
}

export const listOrders = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const res = await axios.get(`${host}/api/orders`, config)

    dispatch({
      type: ORDER_LIST_SUCCESS,
      payload: res.data,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message

    if (message === 'Not Authorized,token failed') {
      dispatch(logout())
    }
    dispatch({
      type: ORDER_LIST_FAIL,
      payload: message,
    })
  }
}

export const deliverOrder = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_DELIVER_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const res = await axios.put(`${host}/api/orders/${id}/deliver`, {}, config)

    dispatch({
      type: ORDER_DELIVER_SUCCESS,
      payload: res.data,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message

    if (message === 'Not Authorized,token failed') {
      dispatch(logout())
    }
    dispatch({
      type: ORDER_DELIVER_FAIL,
      payload: message,
    })
  }
}
