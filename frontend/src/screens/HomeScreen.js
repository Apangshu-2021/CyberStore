import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import { useState, useEffect } from 'react'
import axios from 'axios'

const HomeScreen = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get('/api/products')

      setProducts(data)
    }
    fetchProducts()
  }, [])

  return (
    <>
      <main className='mt-3'>
        <Container>
          <h1>Latest Products</h1>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        </Container>
      </main>
    </>
  )
}

export default HomeScreen
