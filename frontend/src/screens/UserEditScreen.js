import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getUserDetails, updateUser } from '../actions/userActions'
import { Container } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import { USER_UPDATE_RESET } from '../constants/userConstants'

const UserEditScreen = () => {
  const { id } = useParams()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userDetails = useSelector((state) => state.userDetails)
  const userUpdate = useSelector((state) => state.userUpdate)
  const userLogin = useSelector((state) => state.userLogin)
  const { loading, error, user } = userDetails
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate
  const { userInfo } = userLogin

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    } else if (!userInfo.isAdmin) {
      navigate('/')
    } else if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET })
      navigate('/admin/userlist')
    } else {
      if (!user || !user.name || id !== user._id) {
        dispatch(getUserDetails(id))
      } else {
        setName(user.name)
        setEmail(user.email)
        setIsAdmin(user.isAdmin)
      }
    }
  }, [userInfo, user, id, dispatch, successUpdate, navigate])

  const onSubmitHandler = (e) => {
    e.preventDefault()
    dispatch(updateUser({ _id: id, name, email, isAdmin }))
  }

  return (
    <main className='mt-3'>
      <Container>
        <Link
          to='/admin/userlist'
          className='btn btn-light my-3'
          style={{ border: '2px solid black' }}
        >
          Go Back
        </Link>
        <FormContainer>
          <h1 style={{ textAlign: 'center' }}>Edit User</h1>
          {loadingUpdate && <Loader />}
          {errorUpdate && <Message variant='danger' message={errorUpdate} />}
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

              <Form.Group controlId='isAdmin' className='py-1'>
                <Form.Check
                  type='checkbox'
                  label='Is Admin'
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                ></Form.Check>
              </Form.Group>

              <Button variant='primary' type='submit' className='mt-1'>
                Update
              </Button>
            </Form>
          )}
        </FormContainer>
      </Container>
    </main>
  )
}

export default UserEditScreen
