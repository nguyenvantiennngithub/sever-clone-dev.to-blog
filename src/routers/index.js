import authRouter from './auth.js'
import userRouter from './user.js'
import postRouter from './post.js'
import commentRouter from './comment.js'
import notificationRouter from './notification.js'
import express from 'express';
const router = express.Router()

router.use('/auth', authRouter);
router.use('/post', postRouter);
router.use('/user', userRouter);
router.use('/comment', commentRouter);
router.use('/notification', notificationRouter);
export default router;

