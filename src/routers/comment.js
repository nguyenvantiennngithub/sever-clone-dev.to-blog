import express from 'express'
const router = express.Router();
import * as commentController from '../controllers/comment.js'
import {checkAuth} from '../middlewares/auth.js'


router.post('/', checkAuth, commentController.comment)
router.get('/:id', checkAuth, commentController.showReply)
router.patch('/:id', checkAuth, commentController.editComment)
router.delete('/:id', checkAuth, commentController.deleteComment)
router.post('/:id/heart', checkAuth, commentController.heart)

export default router;