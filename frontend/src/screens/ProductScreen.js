import React from 'react'
import {
  Container,
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Card,
} from 'react-bootstrap'
import products from '../products'
import { useParams, Link } from 'react-router-dom'
import Rating from '../components/Rating'

const ProductScreen = () => {
  const { id } = useParams()

  const product = products.find((p) => {
    return p._id === id
  })
  return (
    <>
      <main className='mt-3'>
        <Container>
          <Link className='btn btn-light my-3' to='/'>
            Go Back
          </Link>
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
              <Card className='ms-5'>
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
                        {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item className='btn-group d-flex' role='group'>
                    <Button className='btn' type='button'>
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>
    </>
  )
}

export default ProductScreen
