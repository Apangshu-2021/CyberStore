import React, { useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts } from '../actions/productActions'
import Loader from '../components/Loader.js'
import Message from '../components/Message.js'
import { useParams } from 'react-router-dom'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import Meta from '../components/Meta'
import { Link } from 'react-router-dom'

const HomeScreen = () => {
  const dispatch = useDispatch()
  const { keyword } = useParams()
  const { pageNumber } = useParams()

  const productList = useSelector((state) => state.productList)
  const { loading, products, error, page, pages } = productList

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber || 1))
  }, [dispatch, keyword, pageNumber])

  return (
    <>
      <Meta />
      <main className='mt-3'>
        <Container>
          {!keyword ? (
            <ProductCarousel />
          ) : (
            <Link
              className='btn btn-light my-3'
              style={{ border: '2px solid black' }}
              to='/'
            >
              Go Back
            </Link>
          )}
          <h1>Latest Products</h1>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger' message={error} />
          ) : (
            <>
              <Row>
                {products.map((product) => (
                  <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
              <Paginate
                pages={pages}
                page={page}
                keyword={keyword ? keyword : ''}
              />
            </>
          )}
        </Container>
      </main>
    </>
  )
}

export default HomeScreen
