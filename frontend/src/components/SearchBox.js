import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
const SearchBox = () => {
  const [keyword, setKeyword] = useState('')
  const navigate = useNavigate()

  const onSubmitHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      navigate(`/search/${keyword}`)
    } else {
      navigate('/')
    }
  }

  return (
    <Form
      onSubmit={onSubmitHandler}
      style={{ display: 'flex' }}
      className='mt-2'
    >
      <Form.Control
        type='text'
        name='q'
        placeholder='Search products...'
        className='mr-sm-2 ml-sm-5'
        onChange={(e) => setKeyword(e.target.value)}
      ></Form.Control>
      <Button type='submit' variant='outline-success' className='p-2 ms-2'>
        Search
      </Button>
    </Form>
  )
}

export default SearchBox
