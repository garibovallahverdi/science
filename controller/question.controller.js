import Questions from "../model/questions.model.js";


export const sendQuestion = async (req,res)=>{
    const {fullName,email,headerContent,questionText} = req.body

    try {
        const newQuestion = await Questions.create({
            fullName,email,headerContent,questionText
        })
        await newQuestion.save()
        res.status(200).json({message:"Success question",newQuestion})
    } catch (error) {
        res.status(400).json({message:error})
    }
}

export const getAllQuestions = async (req,res) => {
    try {
        const questions = await Questions.findAll()
        console.log("AAA");
        
        res.status(200).json({message:"All questins",questions})
    } catch (error) {
        res.status(400).json({message:error})
    }
}

export const getByIdQuestion = async (req,res) => {
    const {id} =req.params
    try {
        const question = await Questions.findOne({where:{id}})
          question.readed =true
          await question.save()
        res.status(200).json({message:"One questins",question})
    } catch (error) {
        res.status(400).json({message:error})
    }
}