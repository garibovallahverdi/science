import { fileDelete } from "../middleware/global.functions.js";
import Post from "../model/post.model.js";
import uploadFile from "../middleware/upload.file.js";
import User from "../model/user.model.js";
import { Op } from "sequelize";
import Paragraph from "../model/paragraphs.model.js";
import Group from "../model/group.model.js";







export const getPostById = async (req,res)=>{
    const {id} =req.params
    try {
        const post = await Post.findOne({
            where:{id},
            include: [{
                model: User,
                attributes: ['first_name', 'last_name','id','image']
              },
              'Paragraphs'
            ]
            })
            let num =post.view
            num+=1
            post.view =num
            await post.save()
            res.status(200).json([post])
    } catch (error) {
        res.status(400).json({msg:error})
    }
}

export const savePost= async(req,res)=>{
    const {id} =req.params
    const {userId} = req.body
    try {
        const user= await User.findOne({where:{id:userId}})
        const post= await Post.findOne({where:{id}})
        if(user && post){
            let savePosts = user.savedPosts?[...user.savedPosts]:[]
            savePosts.push(post.id)
            await user.save()
            res.status(200).json({message:'Post has saved'})

        }else {
            res.status(401).json({message:'Post can not save'})

        }
    } catch (error) {
        res.status(400).json(error)
    }
}



export const sharePost = async (req, res) => {
    uploadFile(req, res, async (err) => {
        if (err) { return res.status(400).json({ message: "can not upload", error: err })}
        const { userId,title,category,content,groupId} = req.body
        const  coverImageData = req.files['coverImage'][0]
        const  paragraphData = [...req.files['paragraphImages']]
        const contentsData = content?JSON.parse(content):[]
        try {
            if(contentsData && contentsData.length>0){

             const newPost ={  
                  userId,
                  groupId:groupId?groupId:null,
                  title, 
                  category,
                  coverImage:coverImageData?coverImageData.filename:'',
                  permissionShowGroup:false,
                  requestDenied:false
             }
            const post =await Post.create(newPost)
                contentsData.forEach(async element=>{
                    const newContent ={
                        postId:post.id,
                        headerText:element.headerText, 
                        text:element.text,
                        order:element.order
                    }
                    if(element.fileName){
                        paragraphData.forEach(para=>{
                            if(para.originalname == element.fileName){
                                newContent.fileUrl = para.filename
                            }
 
                        })
                    }
                    const createdContent = await Paragraph.create(newContent)

                }) 
                res.status(200).json(post)
            }else {
                let deletedData = [coverImageData,...paragraphData]
            let files =[]
            deletedData.forEach(data=>{
                files.push(data.filename)
            })

            fileDelete(files)
            res.status(400).json({mesg:"Problem",})

            }
        } catch (error) {
            let deletedData = [coverImageData,...paragraphData]
            let files =[]
            deletedData.forEach(data=>{
                files.push(data.filename)
            })

            fileDelete(files)
            res.status(400).json({mesg:"ERROR",error})
        }


    })
} 

export const updatedPost =async (req,res) => {

    uploadFile(req, res, async (err) => {
        if (err) { return res.status(400).json({ message: "can not upload", error: err })}
        const {id} = req.params
        const {userId,content,title} = req.body
        const coverImage = req.files['coverImage'][0]
        const paragraphImages = req.files['paragraphImages']
        const contentData =content?JSON.parse(content):[]
        let deletedFiles =[]
        try {
            const findPost = await Post.findOne({where:{id},include:'Paragraphs'})
            if(findPost.userId == userId){
            if(coverImage){
                deletedFiles.push(findPost.coverImage)
                findPost.coverImage = coverImage.filename
            } 
            if(title){
                findPost.title =title
            }
            contentData.forEach(data=>{
                paragraphImages.forEach(image=>{
                    if(data.fileName == image.originalname){
                        data.fileUrl = image.filename
                    }
                })
            })
             await Promise.all(contentData.map(async (content,index)=>{
                      const paragraph = findPost.Paragraphs.find(p=>p.id == content.id)
                      if(paragraph){
                        paragraph.headerText = content.headerText?content.headerText:paragraph.headerText
                        paragraph.text = content.text?content.text:paragraph.text
                        paragraph.order = content.order
                        if(content.fileUrl){
                            deletedFiles.push(paragraph.fileUrl)
                            paragraph.fileUrl = content.fileUrl
                        } 
                        await paragraph.save()
                      }else {
                        await Paragraph.create({
                            postId:findPost.id,
                            headerText:content.headerText,
                            text:content.text,
                            fileUrl:content.fileUrl,
                            order : content.order

                        })
                      }
             }))
             fileDelete(deletedFiles)
             await findPost.save()
             res.status(200).json({message:"Post updated"})
            }else {
             res.status(401).json({message:"Permission not granted"})

            }
        } catch (error) {
            let destroyedFiles =[coverImage,...paragraphImages]
            let files =[]
            destroyedFiles.forEach(data=>{
                files.push(data.filename)
            })
            fileDelete(files)
            res.status(400).json({message:error})
        }
    })
}


export const destroyPost =async (req,res)=>{
    const {id} =req.params
    const {userId} = req.body

    try {
        let files =[]
        const findPost = await Post.findOne({where:{id},include:'Paragraphs'})
        if(findPost.userId == userId){

            findPost.Paragraphs.forEach(e=>{
                if(e.fileUrl){
                    files.push(e.fileUrl)
                }
                
                
            })
            files.push(findPost.coverImage)
            await findPost.destroy()
            fileDelete(files)
            res.status(200).json({message:"Post has deleted"})
        }
    } catch (error) {
        res.status(400).json({message:error})
        
    }
}


export const getUserPosts = async (req,res)=>{
    const {userId,pageNumber} =req.params
    const {category} =req.body
    let pageSize = 1
    let offset =(pageNumber-1) * pageSize
    try {
        const userPosts = await  Post.findAll({where:{userId:userId,category:category,groupId:null},
           
            include:[
                {
                    model:User,
                    as:'Creator',
                    attributes:['id','first_name','last_name']
        
                },
            {
            model:Paragraph,
            as:'Paragraphs'
            }
           
         ],
         order: [
            ['createdAt', 'DESC'] // createdAt sütununa göre azalan sırada sırala
          ],
               limit:pageSize,
                offset:offset,
    })

        res.status(200).json({response:userPosts})
    } catch (error) {
        res.status(400).json({message:error})
        
    }
}