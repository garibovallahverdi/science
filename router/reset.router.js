import express from 'express'
import { forgotPassword, resetPssword } from '../middleware/resetpassword.js'
const router =express.Router()

router.post('/forgot-password',forgotPassword) 
router.post('/reset-password/:token',resetPssword) 

export default router   