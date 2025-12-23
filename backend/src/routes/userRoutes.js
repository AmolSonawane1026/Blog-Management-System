import express from 'express'
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// All routes here should be protected and only for admin
router.use(protect)
router.use(authorize('admin'))

router.route('/')
  .get(getUsers)

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser)

export default router
