import express from 'express'
const router = express.Router();
import * as commentController from '../controllers/comment.js'
import {checkAuth} from '../middlewares/auth.js'


router.post('/', checkAuth, commentController.comment)
router.get('/:id', checkAuth, commentController.showReply)
router.post('/:id/heart', checkAuth, commentController.heart)

export default router;