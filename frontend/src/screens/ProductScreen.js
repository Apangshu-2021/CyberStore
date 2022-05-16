import React from 'react'
import {
  Container,
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Card,
  Form,
} from 'react-bootstrap'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Rating from '../components/Rating'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  listProductDetails,
  createProductReview,
} from '../actions/productActions'
import Loader from '../components/Loader.js'
import Message from '../components/Message.js'
import { addToCart } from '../actions/cartActions'
import { PRODUCT_REVIEW_RESET } from '../constants/productConstants'
import Meta from '../components/Meta'

const ProductScreen = () => {
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const dispatch = useDispatch()
  const { id } = useParams()
  const productDetails = useSelector((state) => state.productDetails)
  const productReviewCreate = useSelector((state) => state.productReviewCreate)
  const userLogin = useSelector((state) => state.userLogin)
  const navigate = useNavigate()

  const { loading, product, error } = productDetails
  const {
    success: successReview,
    error: errorReview,
    loading: loadingReview,
  } = productReviewCreate
  const { userInfo } = userLogin

  useEffect(() => {
    if (!product._id || id !== product._id || successReview) {
      setRating(0)
      setComment('')
      dispatch({ type: PRODUCT_REVIEW_RESET })
      dispatch(listProductDetails(id))
    }
  }, [dispatch, navigate, product, userInfo, id, successReview])

  const addToCartHandler = () => {
    dispatch(addToCart(id, Number(qty)))
    navigate(`/cart/${id}?qty=${qty}`)
  }

  const onSubmitHandler = (e) => {
    e.preventDefault()
    dispatch(
      createProductReview(id, {
        rating,
        comment,
      })
    )
  }

  return (
    <>
      <main className='mt-3'>
        <Container>
          <Link
            className='btn btn-light my-3'
            style={{ border: '2px solid black' }}
            to='/'
          >
            Go Back
          </Link>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>{error}</Message>
          ) : (
            <>
              <Meta title={product.name} />
              <Row>
                <Col md={6}>
                  <Image src={product.image} alt={product.name} fluid />
                </Col>
                <Col md={3}>
                  <ListGroup variant='flush'>
                    <ListGroup.Item>
                      <h3>{product.name}</h3>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Rating
                        rating={product.rating}
                        text={`${product.numReviews} reviews`}
                      />
                    </ListGroup.Item>
                    <ListGroup.Item>Price:${product.price}</ListGroup.Item>
                    <ListGroup.Item>
                      Description:{product.description}
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col md={3}>
                  <Card className='ms-md-5' id='add_To_Cart'>
                    {/* className='ms-5' is added because it overlaps the above components at smaller dimensions */}
                    <ListGroup variant='flush'>
                      <ListGroup.Item>
                        <Row>
                          <Col>Price:</Col>
                          <Col>
                            <strong>${product.price}</strong>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Row>
                          <Col>Status:</Col>
                          <Col>
                            {product.countInStock > 0
                              ? 'In Stock'
                              : 'Out Of Stock'}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                      {product.countInStock > 0 && (
                        <ListGroup.Item>
                          <Row>
                            <Col>Qty</Col>
                            <Col>
                              <Form.Control
                                className='form-select'
                                id='productSelect'
                                as='select'
                                value={qty}
                                onChange={(e) => setQty(e.target.value)}
                                style={{ padding: '16px 16px' }}
                              >
                                {[...Array(product.countInStock).keys()].map(
                                  (x) => (
                                    <option key={x + 1} value={x + 1}>
                                      {x + 1}
                                    </option>
                                  )
                                )}
                              </Form.Control>
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      )}
                      <ListGroup.Item className='btn-group d-flex' role='group'>
                        <Button
                          className='btn'
                          type='button'
                          disabled={product.countInStock === 0}
                          onClick={addToCartHandler}
                        >
                          Add To Cart
                        </Button>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <h2 className='mt-2'>Reviews</h2>
                  {product.reviews.length === 0 && (
                    <Message message='No reviews' />
                  )}
                  <ListGroup variant='flush'>
                    {product.reviews.map((review) => (
                      <ListGroup.Item key={review._id}>
                        <strong>{review.name}</strong>
                        <Rating rating={review.rating} />
                        <p>{review.createdAt.substring(0, 10)}</p>
                        <p>{review.comment}</p>
                      </ListGroup.Item>
                    ))}
                    <ListGroup.Item>
                      {successReview && (
                        <Message
                          variant='success'
                          message='Review submitted successfully'
                        />
                      )}
                      {loadingReview && <Loader />}
                      {errorReview && (
                        <Message variant='danger' message={errorReview} />
                      )}
                      <h2>Write a Customer Review</h2>
                      {userInfo ? (
                        <Form onSubmit={onSubmitHandler}>
                          <Form.Group controlId='rating'>
                            <Form.Label>Rating</Form.Label>
                            <Form.Control
                              className='form-select'
                              as='select'
                              value={rating}
                              required
                              onChange={(e) => setRating(e.target.value)}
                            >
                              <option value=''>Select...</option>
                              <option value='1'>1 - Poor</option>
                              <option value='2'>2 - Fair</option>
                              <option value='3'>3 - Good</option>
                              <option value='4'>4 - Very Good</option>
                              <option value='5'>5 - Excellent</option>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group controlId='comment' className='mt-2'>
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                              as='textarea'
                              row='3'
                              value={comment}
                              required
                              onChange={(e) => setComment(e.target.value)}
                            ></Form.Control>
                          </Form.Group>
                          <Button
                            disabled={loadingReview}
                            type='submit'
                            variant='primary'
                            className='mt-2'
                          >
                            Submit
                          </Button>
                        </Form>
                      ) : (
                        <>
                          <p>
                            {' '}
                            Please{' '}
                            <Link
                              style={{
                                textDecoration: 'none',
                                color: 'blueviolet',
                              }}
                              to='/login'
                            >
                              Sign in
                            </Link>{' '}
                            to write a review
                          </p>
                        </>
                      )}
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
            </>
          )}
        </Container>
      </main>
    </>
  )
}

export default ProductScreen
