import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { Container } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'
import axios from 'axios'

const ProductEditScreen = () => {
  const { id } = useParams()

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const productDetails = useSelector((state) => state.productDetails)
  const userLogin = useSelector((state) => state.userLogin)
  const productUpdate = useSelector((state) => state.productUpdate)
  const { loading, error, product } = productDetails
  const { userInfo } = userLogin
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate

  const host =
    process.env.NODE_ENV === 'production'
      ? 'https://cyber-store-five.vercel.app'
      : 'http://localhost:5000'

  //const host = 'http://localhost:5000'

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    } else if (!userInfo.isAdmin) {
      navigate('/')
    } else if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET })
      navigate('/admin/productlist')
    } else {
      if (!product || !product.name || id !== product._id) {
        dispatch(listProductDetails(id))
      } else {
        setName(product.name)
        setPrice(product.price)
        setImage(product.image)
        setBrand(product.brand)
        setCategory(product.category)
        setCountInStock(product.countInStock)
        setDescription(product.description)
      }
    }
  }, [userInfo, product, id, dispatch, navigate, successUpdate])

  const onSubmitHandler = (e) => {
    e.preventDefault()
    dispatch(
      updateProduct({
        _id: id,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      })
    )
  }

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.post(`${host}/api/upload`, formData, config)

      setImage(data)
      setUploading(false)
    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }

  return (
    <main className='mt-3'>
      <Container>
        <Link
          to='/admin/productlist'
          className='btn btn-light my-3'
          style={{ border: '2px solid black' }}
        >
          Go Back
        </Link>
        <FormContainer>
          <h1 style={{ textAlign: 'center' }}>Edit Product</h1>
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

              <Form.Group controlId='price' className='py-1'>
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type='number'
                  placeholder='Enter Price'
                  value={price}
                  required
                  onChange={(e) => setPrice(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='image' className='py-1'>
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter Image URL'
                  value={image}
                  required
                  onChange={(e) => setImage(e.target.value)}
                ></Form.Control>
                <Form.Control
                  type='file'
                  label='Choose File'
                  onChange={uploadFileHandler}
                ></Form.Control>
                {uploading && <Loader />}
              </Form.Group>

              <Form.Group controlId='brand' className='py-1'>
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter Brand'
                  value={brand}
                  required
                  onChange={(e) => setBrand(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='countInStock' className='py-1'>
                <Form.Label>Count In Stock</Form.Label>
                <Form.Control
                  type='number'
                  placeholder='Enter Count In Stock'
                  value={countInStock}
                  required
                  onChange={(e) => setCountInStock(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='category' className='py-1'>
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter Category'
                  value={category}
                  required
                  onChange={(e) => setCategory(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='description' className='py-1'>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter Description'
                  value={description}
                  required
                  onChange={(e) => setDescription(e.target.value)}
                ></Form.Control>
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

export default ProductEditScreen
