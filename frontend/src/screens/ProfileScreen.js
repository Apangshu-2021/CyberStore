import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Form, Button, Row, Col, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getUserDetails, updateUserDetails } from '../actions/userActions'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'
import { listMyOrders } from '../actions/orderActions'

const ProfileScreen = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setconfirmPassword] = useState('')
  const [message, setMessage] = useState(null)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userLogin = useSelector((state) => state.userLogin)
  const userDetails = useSelector((state) => state.userDetails)
  const orderListMy = useSelector((state) => state.orderListMy)
  const { userInfo } = userLogin
  const { loading, error, user } = userDetails
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
  const { success } = userUpdateProfile

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    } else {
      if (!user || !user.email || success) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET })
        dispatch(getUserDetails('profile'))
        dispatch(listMyOrders())
      } else {
        setName(user.name)
        setEmail(user.email)
        setPassword('')
        setconfirmPassword('')
      }
    }
  }, [userInfo, navigate, dispatch, user, success])

  const onSubmitHandler = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      dispatch(updateUserDetails({ id: user._id, name, email, password }))
    }
  }
  return (
    <main className='mt-3'>
      <Container>
        <Row>
          <Col md={3}>
            <h2 style={{ textAlign: 'center' }}>User Profile</h2>
            {message && <Message variant='danger' message={message} />}
            {/* {success && <Message variant='success' message='Profile Updated' />} */}
            {loading ? (
              <Loader />
            ) : error ? (
              <Message variant='danger' message={error} />
            ) : (
              <Form onSubmit={onSubmitHandler}>
                <Form.Group controlId='name' className='py-1'>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type='name'
                    placeholder='Enter Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId='email' className='py-1'>
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type='email'
                    placeholder='Enter Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId='password' className='py-1'>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Enter Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId='confirmPassword' className='py-1'>
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Confirm Password'
                    value={confirmPassword}
                    onChange={(e) => setconfirmPassword(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Button variant='primary' type='submit' className='mt-1'>
                  Update
                </Button>
              </Form>
            )}
          </Col>
          <Col md={9}>
            <h2 style={{ textAlign: 'center' }}>My Orders</h2>
            {loadingOrders ? (
              <Loader />
            ) : errorOrders ? (
              <Message variant='danger' message={errorOrders} />
            ) : (
              <Table striped bordered hover responsive className='table-sm'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>PAID AT</th>
                    <th>DELIVERED</th>
                    <th>ORDER DETAILS</th>
                  </tr>
                </thead>
                <tbody>
                  {orders &&
                    orders.map((order) => (
                      <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>{order.createdAt.substring(0, 10)}</td>
                        <td>{order.totalPrice}</td>
                        <td>
                          {order.isPaid ? (
                            order.paidAt.substring(0, 10)
                          ) : (
                            <i
                              className='fas fa-times'
                              style={{ color: 'red' }}
                            ></i>
                          )}
                        </td>
                        <td>
                          {order.isDelivered ? (
                            order.deliveredAt.substring(0, 10)
                          ) : (
                            <i
                              className='fas fa-times'
                              style={{ color: 'red' }}
                            ></i>
                          )}
                        </td>
                        <td>
                          <LinkContainer to={`/order/${order._id}`}>
                            <Button variant='light' className='btn-sm'>
                              Details
                            </Button>
                          </LinkContainer>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
      </Container>
    </main>
  )
}

export default ProfileScreen
