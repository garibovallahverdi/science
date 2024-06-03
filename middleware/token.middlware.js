// import jwt from 'jsonwebtoken'
// import dotenv from 'dotenv'
// import User from '../model/user.model.js'

// dotenv.config()
 
// const createAccessToken = (id,email) =>{
//     return jwt.sign({id,email},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1m'})
// }
 
// const createRefreshToken = (id,email) =>{
//     return jwt.sign({id,email},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'2h'})
// }



// //  const checkRefreshToken = async (req,res)=>{
// //     const token = req.headers['authorization']
// //     const decoded =  jwt.verify(token,process.env.REFRESH_TOKEN_SECRET)
// //     console.log(decoded);
// //     if(decoded) {
// //        const user = await User.findByPk(decoded.id.id)
// //        const accessToken = createAccessToken({id:user.id,email:user.email})
// //        res.status(200).json({user,accessToken})

// //     }else {
// //        res.status(401).json({user:null,accessToken:null})
// //     }

// // } 
// //  const checkAccessToken = async (req,res,next)=>{
// //    const token = req.headers['authorization']
// //    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
// //      if(err){
// //        return res.send(err)
// //      }
// //     next()

// //    })

// // }

// export {    
//     createAccessToken,
//     createRefreshToken,
// }