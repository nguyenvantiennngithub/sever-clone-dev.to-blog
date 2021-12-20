import express from 'express'
const router = express.Router();
import * as authController from '../controllers/auth.js'

router.post('/register-user', authController.registerUser)
router.get('/verify-token', authController.verifyToken)
router.post('/login', authController.checkLogin)

export default router;