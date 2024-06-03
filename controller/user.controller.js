import { fileDelete } from "../middleware/global.functions.js";
// import { createAccessToken, createRefreshToken } from "../middleware/token.middlware.js";
import uploadFile from "../middleware/upload.file.js";
import Group from "../model/group.model.js";
import Post from "../model/post.model.js";
import User from "../model/user.model.js";
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { Op } from "sequelize";
dotenv.config()

  

export const register =async (req,res,next)=>{
    const {first_name,last_name,phone_number,email,password}= req.body
    
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password,salt)
    const user = await User.create({first_name,last_name,phone_number,email,password:hashPassword,confirmed:false})
    try {  

        const token = crypto.randomBytes(20).toString('hex')
        user.verifyToken =token
        user.verifyTokenExpires =Date.now() + 3600000

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NODEMAILER_ADRESS,
                pass: process.env.NODEMAILER_PASS,
            },
        });
        let verificationLink = `http://${req.headers.host}/user/verify-email/${token}`
        const mailBody = `
            <p style="font-size:20px, font-weight:bold">Hesabinizi təsdiqləmək üçün butona klikləyin.</p>
            <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 15px 25px; text-align: center; text-decoration: none; display: inline-block; font-size: 20px; font-weight: bold; margin: 4px 2px; cursor: pointer; border-radius: 10px;">
            Hesabımı Təsdiqlə</a>`
        const mailOptions = {
            to: user.email,
            from: process.env.NODEMAILER_ADRESS,
            subject: 'Hesabınızı doğrulayın', 
            html:mailBody
        };
        await user.save()
        await transporter.sendMail(mailOptions);
        res.redirect()
        res.status(200).json({message:'User registered. Verification email sent.'})


        
    } catch (error) {
        await user.destroy()
        res.status(400).json({message:error}) 
           
    } 
}

export const VerifyEmailDoneRegister =async (req,res)=>{
    const user =await User.findOne({
        where:{
            verifyToken:req.params.token,
            verifyTokenExpires:{[Op.gt]:Date.now()}

        }
    })

    
    
    try {
        if(user){
            
            user.confirmed =true
            user.verifyToken =null
            user.verifyTokenExpires =null
            await user.save()
            req.login(user, (err) => {
                if (err) return next(err);
                res.redirect(process.env.FRONTEND_URL + '/profile');
            });
          
        }else {
            res.status(401).json({message:"TokenExpiredError"})
        }
    } catch (error) {
        res.status(400).json({message:error})
        
    }
}

export const login = async (req,res)=>{

    const {email,password}= req.body

    try {
        const user = await User.findOne({where:{email}})
        if(user){
           const auth = await bcrypt.compare(password,user.password)
             if(auth){
                const refreshToken = createRefreshToken({id:user.id,email:user.email})
                const accessToken = createAccessToken({id:user.id,email:user.email})
                res.status(200).json({message:"Succesfull",user,accessToken})
             }else {
                res.status(401).json({message:"Wrong password"})
             }
        }else {
            res.status(401).json({message:"Email does not exsis, try register"})
        }
    } catch (error) {
        res.status(400).json({message:error})
    }

}

export const destroyUser =async (req,res)=>{

    const {id} =req.params
    try {
        let files =[]
        const posts = await Post.findAll({where:{userId:id},include:'Paragraphs'})
        
        console.log(posts.Paragraphs);
        posts.forEach(post=>{
            files.push(post.coverImage)
            post.Paragraphs.forEach(para=>{
                if(para.fileUrl){
                    files.push(para.fileUrl)
                }
            })
        })
       
        const destroyUser =await User.destroy({where:{id}})
        fileDelete(files)
        res.status(200).json({message:"User has deleted",destroyUser})
    } catch (error) {
        res.status(400).json({message:error})
        
    }
}


export const editProfileInfo =async (req,res)=>{
    const {id} = req.params
     const user =await User.findOne({where:{id}})
     if(user){

    uploadFile(req, res, async (err) => {
        if (err) { return res.status(400).json({ message: "can not upload", error: err })}
        const {first_name,last_name,job,email,phone_number} =req.body
        const profileImage = req.files['profileImage'][0]
        let files =[]
        try {
            if(first_name){ user.first_name = first_name}
            if(last_name){ user.last_name = last_name}
            if(job){ user.job = job}
            if(phone_number){ user.phone_number = phone_number}
            if(email){ user.email = email}

            if(profileImage){

                if(user.image){
                    files.push(user.image)
                    fileDelete(files)
                }
                user.image = profileImage.filename
            }

            await user.save()
            res.status(200).json({msg:"User edit succesfull",user})

        } catch (error) {
            res.status(400).json({msg:error,user})
            
        }
    })
}else {
    res.status(401).json({msg:"Something went wrong"})
}
    
}

export const getUserById = async (req,res)=>{
    const {id} =req.params
    try {
        const user= await User.findByPk(id)

        if(user){
            res.status(200).json({response:user})
        }else {
            res.status(401).json({message:"Can not find user"})
        }
    } catch (error) {
        res.status(400).json({message:error})
        
    }
}

export const getUserGroups  = async (req,res)=>{
    const {id,pageNumber} =req.params
    let pageSize = 1
    let offset =(pageNumber-1) * pageSize
    try {
        const user = await User.findByPk(id)
        const groups = await Group.findAll({where:{id:user.groups},
            limit:pageSize,
            offset:offset,})
        // console.log(group);
        res.status(200).json(groups)
    } catch (error) {
        res.status(400).json({msg:error})
    }
}