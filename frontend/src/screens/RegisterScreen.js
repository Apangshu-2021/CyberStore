import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { register } from '../actions/userActions'
import FormContainer from '../components/FormContainer'

const RegisterScreen = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setconfirmPassword] = useState('')
  const [message, setMessage] = useState(null)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userRegister = useSelector((state) => state.userRegister)
  const { loading, userInfo, error } = userRegister

  useEffect(() => {
    if (userInfo) {
      navigate('/')
    }
  }, [userInfo, navigate])

  const onSubmitHandler = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      dispatch(register(name, email, password))
    }
  }
  return (
    <main className='mt-3'>
      <FormContainer>
        <h1 style={{ textAlign: 'center' }}>Sign Up</h1>
        {message && <Message variant='danger' message={message} />}
        {error && <Message variant='danger' message={error} />}
        {loading && <Loader />}
        <Form onSubmit={onSubmitHandler}>
          <Form.Group controlId='name' className='py-1'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='name'
              placeholder='Enter Name'
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

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
              onChange={(e) => setPassword(e.target.value)}
              minLength={5}
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='confirmPassword' className='py-1'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm Password'
              value={confirmPassword}
              onChange={(e) => setconfirmPassword(e.target.value)}
              minLength={5}
              required
            ></Form.Control>
          </Form.Group>

          <Button variant='primary' type='submit' className='mt-1'>
            Register
          </Button>
        </Form>
        <Row className='py-3'>
          <Col>
            Have an Account?
            <Link
              to='/login'
              style={{ textDecoration: 'none', color: 'blueviolet' }}
            >
              Login
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </main>
  )
}

export default RegisterScreen
