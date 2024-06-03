import express from 'express'
import { destroyPost, getPostById, getUserPosts, savePost, sharePost, updatedPost } from '../controller/post.controller.js'
// import { checkAccessToken } from '../middleware/token.middlware.js'

const router = express.Router()

router.post('/share',sharePost)
router.post('/update/:id',updatedPost)
router.post('/destroy/:id',destroyPost)
router.get('/getpostbyid/:id',getPostById)
router.get('/savepost/:id',savePost)
router.get('/getuserposts/:userId/:pageNumber',getUserPosts)

 
export default router  