import express from 'express'
const router = express.Router();
import * as homeController from '../controllers/home.js'
import {checkAuth} from '../middlewares/auth.js'
router.get('/create-post', checkAuth, homeController.home)

export default router;