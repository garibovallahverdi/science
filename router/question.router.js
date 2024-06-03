import express from 'express'
import { getAllQuestions, getByIdQuestion, sendQuestion } from '../controller/question.controller.js'
const router =express.Router()

 router.post("/send",sendQuestion)
 router.get("/getall",getAllQuestions)
 router.get("/getbyid/:id",getByIdQuestion)

export default router    