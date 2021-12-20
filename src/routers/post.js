import express from 'express'
const router = express.Router();
import * as postController from '../controllers/post.js'
import {checkAuth} from '../middlewares/auth.js'
router.post('/upload-image', checkAuth, postController.uploadImage)
router.post('/create-post', checkAuth, postController.createPost)
router.get('/:slug', checkAuth, postController.getPostBySlug)
router.post('/:slug/heart', checkAuth, postController.heart)
router.post('/:slug/bookmark', checkAuth, postController.bookmark)

export default router;