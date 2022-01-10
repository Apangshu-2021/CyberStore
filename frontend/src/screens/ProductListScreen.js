import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Row, Col, Table, Button, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
  createProduct,
  deleteProduct,
  listProducts,
} from '../actions/productActions'
import { useNavigate, useParams } from 'react-router-dom'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'
import Paginate from '../components/Paginate'

const ProductListScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pageNumber } = useParams()

  const productList = useSelector((state) => state.productList)
  const userLogin = useSelector((state) => state.userLogin)
  const productDelete = useSelector((state) => state.productDelete)
  const productCreate = useSelector((state) => state.productCreate)

  const { userInfo } = userLogin
  const { products, loading, error, pages, page } = productList
  const {
    success: successDelete,
    loading: loadingDelete,
    error: errorDelete,
  } = productDelete
  const {
    loading: loadingCreate,
    success: successCreate,
    product: createdProduct,
    error: errorCreate,
  } = productCreate

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    } else if (!userInfo.isAdmin) {
      navigate('/')
    } else if (successCreate) {
      dispatch({ type: PRODUCT_CREATE_RESET })
      navigate(`/admin/product/${createdProduct._id}/edit`)
    } else {
      dispatch(listProducts('', pageNumber || 1))
    }
  }, [
    userInfo,
    navigate,
    dispatch,
    successDelete,
    successCreate,
    createdProduct,
    pageNumber,
  ])

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteProduct(id))
    }
  }
  const createProductHandler = () => {
    dispatch(createProduct())
  }

  return (
    <main className='mt-3'>
      <Container>
        <Row className='align-items-center'>
          <Col md={9}>
            <h1>Products</h1>
          </Col>
          <Col md={3} className='my-3'>
            <Button type='button' onClick={createProductHandler}>
              <i className='fas fa-plus'></i> Create Product
            </Button>
          </Col>
        </Row>
        {loadingDelete && <Loader />}
        {errorDelete && <Message variant='danger' message={errorDelete} />}
        {loadingCreate && <Loader />}
        {errorCreate && <Message variant='danger' message={errorCreate} />}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger' message={error} />
        ) : (
          <>
            <Table striped bordered hover responsive className='table-sm'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>PRICE</th>
                  <th>CATEGORY</th>
                  <th>BRAND</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>${product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>
                      <LinkContainer to={`/admin/product/${product._id}/edit`}>
                        <Button className='btn-sm' variant='light'>
                          <i className='fas fa-edit'></i>
                        </Button>
                      </LinkContainer>
                      <Button
                        className='btn-sm'
                        variant='danger'
                        onClick={() => {
                          deleteHandler(product._id)
                        }}
                      >
                        {' '}
                        <i className='fas fa-trash'></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Paginate pages={pages} page={page} isAdmin={true} />
          </>
        )}
      </Container>
    </main>
  )
}

export default ProductListScreen
