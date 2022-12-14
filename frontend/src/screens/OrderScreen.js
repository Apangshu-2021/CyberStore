import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Container,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Button,
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import { useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
import { Link, useParams } from 'react-router-dom'
import {
  deliverOrder,
  getOrderDetails,
  payOrder,
} from '../actions/orderActions'
import { PayPalButton } from 'react-paypal-button-v2'
import {
  ORDER_DELIVER_RESET,
  ORDER_PAY_RESET,
} from '../constants/orderConstants'

const host =
  process.env.NODE_ENV === 'production'
    ? 'https://cyber-store-five.vercel.app'
    : 'http://localhost:5000'

//const host = 'http://localhost:5000'

const OrderScreen = (props) => {
  const dispatch = useDispatch()
  const { id } = useParams()

  const orderDetails = useSelector((state) => state.orderDetails)
  const orderPay = useSelector((state) => state.orderPay)
  const userLogin = useSelector((state) => state.userLogin)
  const orderDeliver = useSelector((state) => state.orderDeliver)

  const { order, loading, error } = orderDetails
  const { loading: loadingPay, success: successPay } = orderPay
  const { userInfo } = userLogin
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver

  const navigate = useNavigate()
  const [sdkReady, setSdkReady] = useState(false)

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    }
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get(`${host}/api/config/paypal`)
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
      script.onload = () => {
        setSdkReady(true)
      }
      document.body.appendChild(script)
    }

    if (!order || order._id !== id || successPay || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_DELIVER_RESET })
      dispatch(getOrderDetails(id))
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript()
      } else {
        setSdkReady(true)
      }
    }
  }, [userInfo, navigate, dispatch, order, id, successPay, successDeliver])

  const successPaymentHandler = (paymentResult) => {
    //  console.log(paymentResult)
    dispatch(payOrder(id, paymentResult))
  }

  const deliverHandler = () => {
    dispatch(deliverOrder(id))
  }

  return (
    <main className='mt-3'>
      <Container>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger' message={error} />
        ) : (
          <>
            <h1>Order {order._id}</h1>
            <Row>
              <Col md={8}>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <h2>Shipping</h2>
                    <p>
                      <strong>Name:</strong>
                      {order.user.name}
                    </p>
                    <p>
                      <strong>Email:</strong>
                      <a
                        href={`mailto:${order.user.email}`}
                        target='_blank'
                        rel='noreferrer'
                        style={{ textDecoration: 'none' }}
                      >
                        {order.user.email}
                      </a>
                    </p>
                    <p>
                      <strong>Address:</strong>
                      {order.shippingAddress.address},
                      {order.shippingAddress.city},
                      {order.shippingAddress.postalCode},
                      {order.shippingAddress.country}
                    </p>
                    {order.isDelivered ? (
                      <Message
                        variant='success'
                        message={`Delivered on ${order.deliveredAt}`}
                      />
                    ) : (
                      <Message variant='danger' message='Not Delivered' />
                    )}
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <h2>Payment Method</h2>
                    <p>
                      <strong>Method:</strong>
                      {order.paymentMethod}
                    </p>
                    {order.isPaid ? (
                      <Message
                        variant='success'
                        message={`Paid on ${order.paidAt}`}
                      />
                    ) : (
                      <Message variant='danger' message='Not Paid' />
                    )}
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <h2>Order Items</h2>
                    {order.orderItems.length === 0 ? (
                      <Message message='Order is empty' />
                    ) : (
                      <ListGroup variant='flush'>
                        {order.orderItems.map((item, index) => (
                          <ListGroup.Item key={index}>
                            <Row>
                              <Col md={1}>
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fluid
                                  rounded
                                />
                              </Col>
                              <Col>
                                <Link
                                  to={`/product/${item.product}`}
                                  style={{ textDecoration: 'none' }}
                                >
                                  {item.name}
                                </Link>
                              </Col>
                              <Col md={4}>
                                {item.qty} x ${item.price} = $
                                {item.qty * item.price}
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}
                  </ListGroup.Item>
                </ListGroup>
              </Col>

              <Col md={4}>
                <Card>
                  <ListGroup variant='flush'>
                    <ListGroup.Item>
                      <h2>Order Summary</h2>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Row>
                        <Col>Items</Col>
                        <Col>${order.itemsPrice}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Shipping</Col>
                        <Col>${order.shippingPrice}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Tax</Col>
                        <Col>${order.taxPrice}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Total</Col>
                        <Col>${order.totalPrice}</Col>
                      </Row>
                    </ListGroup.Item>
                    {!order.isPaid && (
                      <ListGroup.Item>
                        {loadingPay && <Loader />}
                        {!sdkReady ? (
                          <Loader />
                        ) : (
                          <PayPalButton
                            amount={order.totalPrice}
                            onSuccess={successPaymentHandler}
                          />
                        )}
                      </ListGroup.Item>
                    )}
                    {loadingDeliver && <Loader />}
                    {userInfo &&
                      userInfo.isAdmin &&
                      order &&
                      order.isPaid &&
                      !order.isDelivered && (
                        <ListGroup.Item
                          className='btn-group d-flex'
                          role='group'
                        >
                          <Button
                            className='btn'
                            type='button'
                            onClick={deliverHandler}
                          >
                            Mark as Delivered
                          </Button>
                        </ListGroup.Item>
                      )}
                  </ListGroup>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </main>
  )
}

export default OrderScreen
