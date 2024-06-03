import express from 'express'
import { getPostsBySearch } from '../controller/search.controller.js'
const router =express.Router()

router.get('/posts',getPostsBySearch)

export default router    