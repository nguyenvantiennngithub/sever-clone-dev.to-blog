import express from 'express'
const router = express.Router();
import * as notificationController from '../controllers/notification.js'
import {checkAuth} from '../middlewares/auth.js'

router.get('/', checkAuth, notificationController.getNotification)
router.post('/seen', checkAuth, notificationController.seen)

export default router;