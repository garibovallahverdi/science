import nodemailer from 'nodemailer'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import User from '../model/user.model.js'
import { Op } from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

export const forgotPassword = async(req,res)=>{
    const {email} =req.body

    try {
        const user = await User.findOne({where:{email}})

        if(!user){
            res.status(400).json({message:'User with given email does not exist.'});
        }

        const token = crypto.randomBytes(20).toString('hex')
        let randomCode =Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        user.resetPasswordToken = token
        user.resetPasswordExpires =Date.now()+ 3600000 
        user.resetPasswordCode = randomCode 

        await user.save()

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NODEMAILER_ADRESS,
                pass: process.env.NODEMAILER_PASS,
            },
        });

        

        const mailOptions = {
            to: user.email,
            from: process.env.NODEMAILER_ADRESS,
            subject: 'Password Reset',
            text: `Confirm code: ${user.resetPasswordCode}.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            http://${req.headers.host}/reset/reset-password/${token}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({message:'A password reset link has been sent to your email address.'})


    } catch (error) {
        res.status(500).json({msg:error});

    }
}

export const resetPssword =async (req,res)=>{
    try {
        
        const user =await User.findOne({
            where:{
                resetPasswordToken:req.params.token,
                resetPasswordExpires:{[Op.gt]:Date.now()},
                resetPasswordCode:req.body.code
                
            }
        })
        console.log(user);

    if(!user){res.statu(401).json({message:"Password reset token is invalid or has expired."})}

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password,salt)
    user.password = hashPassword
    user.resetPasswordToken =null
    user.resetPasswordExpires =null
    user.resetPasswordCode = null
    await user.save()
    res.status(200).json({message:"Password has been reset !"})
} catch (error) {
    res.status(400).json({message:error})
        
}
}