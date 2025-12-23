import express from 'express'
import multer from 'multer'
import {
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  uploadBlogImage,
  getCloudinaryImages,
  deleteCloudinaryImage,
  getBlogStats,
  getMyBlogs
} from '../controllers/blogController.js'
import { protect, authorize, optionalProtect } from '../middleware/auth.js'

const router = express.Router()

// Configure multer for memory storage
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'), false)
    }
  }
})

// Public routes
router.get('/', optionalProtect, getAllBlogs)

// Protected routes - Specific endpoints must come before parameterized routes
router.get('/images', protect, getCloudinaryImages)
router.delete('/images/:public_id', protect, deleteCloudinaryImage)
router.get('/admin/stats', protect, getBlogStats)
router.get('/me/all', protect, getMyBlogs)

// Public routes - Parameterized
router.get('/:slug', getBlogBySlug)

// Protected routes - Operations
router.post('/', protect, authorize('admin', 'editor', 'user'), createBlog)
router.put('/:id', protect, authorize('admin', 'editor', 'user'), updateBlog)
router.delete('/:id', protect, authorize('admin', 'editor', 'user'), deleteBlog)
router.post('/upload-image', protect, upload.single('image'), uploadBlogImage)

export default router
