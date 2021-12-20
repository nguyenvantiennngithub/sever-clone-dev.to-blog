import express from 'express'
import * as userController from '../controllers/user.js'
import {checkAuth} from '../middlewares/auth.js'


const router = express.Router();

router.post('/:author/follow', checkAuth, userController.follow)

export default router;