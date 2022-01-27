import express from 'express'
const router = express.Router();
import * as postController from '../controllers/post.js'
import {checkAuth} from '../middlewares/auth.js'
router.post('/upload-image', checkAuth, postController.uploadImage)
router.post('/create-post', checkAuth, postController.createPost)
router.get('/all', postController.getAll)
router.get('/personal-post', checkAuth, postController.getPersonalPosts)
router.get('/:slug', postController.getPostBySlug)
router.post('/:slug/heart', checkAuth, postController.heart)
router.post('/:slug/bookmark', checkAuth, postController.bookmark)
router.post('/:slug/edit', checkAuth, postController.editPost)
router.post('/:slug/delete', checkAuth, postController.deletePost)
router.get('/:username/profile', postController.getProfile)
export default router;