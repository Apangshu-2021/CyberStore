import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import { useState, useEffect } from 'react'
import axios from 'axios'

const HomeScreen = () => {
  const [products, setProducts] = useState([])
  const host = 'http://localhost:5000'
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get(`${host}/api/products`)

      setProducts(res.data)
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
