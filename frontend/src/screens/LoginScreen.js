import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { login } from '../actions/userActions'
import FormContainer from '../components/FormContainer'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  //const location = useLocation()
  const navigate = useNavigate()
  // console.log(location.search)
  // const redirect = location.search ? location.search.split('=')[1] : '/'
  const dispatch = useDispatch()
  const userLogin = useSelector((state) => state.userLogin)
  const { loading, userInfo, error } = userLogin

  useEffect(() => {
    if (userInfo) {
      navigate('/')
    }
  }, [userInfo, navigate])

  const onSubmitHandler = (e) => {
    e.preventDefault()
    dispatch(login(email, password))
  }
  return (
    <main className='mt-3'>
      <FormContainer>
        <h1 style={{ textAlign: 'center' }}>Sign In</h1>
        {error && <Message variant='danger' message={error} />}
        {loading && <Loader />}
        <Form onSubmit={onSubmitHandler}>
          <Form.Group controlId='email' className='py-1'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter Email'
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='password' className='py-1'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter Password'
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button variant='primary' type='submit' className='mt-1'>
            Sign In
          </Button>
        </Form>
        <Row className='py-3'>
          <Col>
            New Customer?
            <Link
              to='/register'
              style={{ textDecoration: 'none', color: 'blueviolet' }}
            >
              Register
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </main>
  )
}

export default LoginScreen
