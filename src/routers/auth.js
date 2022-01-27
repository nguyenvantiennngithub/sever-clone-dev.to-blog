import express from 'express'
const router = express.Router();
import * as authController from '../controllers/auth.js'
import {checkAuth} from '../middlewares/auth.js'

router.post('/register-user', authController.registerUser)
router.post('/login-social', authController.loginSocial)
router.get('/verify-token', authController.verifyToken)
router.post('/login', authController.checkLogin)
router.post('/update-info', checkAuth, authController.updateInfo)
router.post('/change-password', checkAuth, authController.changePassword)
export default router;