import React from 'react'
import { Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Message from '../components/Message'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import { addToCart, removeFromCart } from '../actions/cartActions'

const CartScreen = () => {
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart
  const navigate = useNavigate()
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }
  const checkoutHandler = () => {
    if (!userInfo) {
      navigate('/login')
    }
    navigate('/shipping')
  }
  return (
    <main className='mt-3'>
      <Container>
        <Row>
          <Col md={8}>
            <Link
              className='btn btn-light'
              style={{ border: '2px solid black' }}
              to='/'
            >
              Go Back
            </Link>
            <h1 className='mt-2'>Shopping Cart</h1>
            {cartItems.length === 0 ? (
              <Message message={`Your cart is Empty`} />
            ) : (
              <ListGroup variant='flush'>
                {cartItems.map((item) => (
                  <ListGroup.Item key={item.product}>
                    <Row>
                      <Col md={2}>
                        <Image src={item.image} alt={item.name} fluid></Image>
                      </Col>
                      <Col md={3}>
                        <Link
                          to={`/product/${item.product}`}
                          style={{ textDecoration: 'none' }}
                        >
                          {item.name}
                        </Link>
                      </Col>
                      <Col md={2}>${item.price}</Col>
                      <Col>
                        <Form.Control
                          className='form-select'
                          as='select'
                          value={item.qty}
                          onChange={(e) =>
                            dispatch(
                              addToCart(item.product, Number(e.target.value))
                            )
                          }
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                      <Col md={2}>
                        <Button
                          type='button'
                          variant='light'
                          onClick={() => {
                            removeFromCartHandler(item.product)
                          }}
                        >
                          <i className='fas fa-trash'></i>
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Col>
          <Col md={4}>
            <Card style={{ marginTop: '52px' }}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>
                    Subtotal (
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
                  </h3>
                  $
                  {cartItems
                    .reduce((acc, item) => acc + item.price * item.qty, 0)
                    .toFixed(2)}
                </ListGroup.Item>
                <ListGroup.Item className='btn-group d-flex' role='group'>
                  <Button
                    type='button'
                    className='btn'
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                  >
                    Proceed to Checkout
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  )
}

export default CartScreen
