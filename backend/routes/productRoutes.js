import express from 'express'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()
import {
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProduct,
  reviewProduct,
  getTopRatedProducts,
} from '../controllers/productControllers.js'

router.route('/').get(getProducts).post(protect, admin, createProduct)
router.get('/top', getTopRatedProducts)
router.route('/:id/reviews').post(protect, reviewProduct)

router
  .route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct)

export default router
