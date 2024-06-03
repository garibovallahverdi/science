import { Op } from "sequelize"
import Post from "../model/post.model.js"

export const getPostsBySearch = async(req,res)=>{
    const {search} =req.query
    try {
        const post = await Post.findAll({where:{
           [Op.and]:[
            {slug:{
                [Op.like]:`%${search}%`}
            }
           ],
           groupId:null
        }, 
       include: [{
        model: User,
        attributes: ['first_name', 'last_name','id','image']
      },]
    })
        res.status(200).json({post,l:post.length})
    } catch (error) {
        res.status(400).json({error})
    }
}