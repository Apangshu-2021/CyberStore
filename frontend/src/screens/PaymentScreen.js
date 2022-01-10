import React, { useState, useEffect } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { useNavigate } from 'react-router-dom'
import { savePaymentMethod } from '../actions/cartActions'
import CheckoutSteps from '../components/CheckoutSteps'

const PaymentScreen = () => {
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart)
  const userLogin = useSelector((state) => state.userLogin)
  const { shippingAddress } = cart
  const { userInfo } = userLogin
  const navigate = useNavigate()

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    }
    if (!shippingAddress || !shippingAddress.address) {
      navigate('/shipping')
    }
  }, [userInfo, navigate, shippingAddress])

  const [paymentMethod, setPaymentMethod] = useState('Paypal')

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    navigate('/placeOrder')
  }

  return (
    <main className='mt-3'>
      <FormContainer>
        <CheckoutSteps step1='step1' step2='step2' step3='step3' />
        <h1>Payment Method</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label as='legend'>Select Method</Form.Label>
            <Col>
              <Form.Check
                id='Paypal'
                type='radio'
                label='Paypal or Credit Card'
                name='paymentMethod'
                value='Paypal'
                checked
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
              {/* <Form.Check
                id='Stripe'
                type='radio'
                label='Stripe'
                name='paymentMethod'
                value='Stripe'
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check> */}
            </Col>
          </Form.Group>
          <Button variant='primary' type='submit' className='mt-1'>
            Continue
          </Button>
        </Form>
      </FormContainer>
    </main>
  )
}

export default PaymentScreen
