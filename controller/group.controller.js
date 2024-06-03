import { fileDelete } from "../middleware/global.functions.js";
import GroupAdmin from "../model/group.admin.model.js";
import Group from "../model/group.model.js";
import Notifications from "../model/notifications.model.js";
import Paragraph from "../model/paragraphs.model.js";
import Post from "../model/post.model.js";
import User from "../model/user.model.js";
import { Op } from "sequelize";

export const createGroup = async (req,res)=>{
    const {userId,groupName} = req.body

    try {
        const user =await User.findOne({where:{id:userId}})
        let groups = user.groups?[...user.groups]:[]
        const newGroup = await Group.create({groupName})
        const admin = await GroupAdmin.create({
            groupId:newGroup.id,
            userId:userId,
            creator:true
        })
        groups.push(newGroup.id)
        newGroup.admins = [admin.id]
        newGroup.members = [userId]
        user.groups =[...groups]
         await user.save()
         await newGroup.save() 
         await  admin.save()
         res.status(200).json({message:`Created "${newGroup.groupName}" group` })
    } catch (error) {
        res.status(400).json({msg:error})
    }


}

export const sendJoinRequestToGroup = async (req,res)=>{

    const {id} =req.params
    const {userId} =req.body

    try {
        const findGroup = await Group.findOne({where:{id}})
        const findUser = await User.findOne({where:{id:userId}})
        if(findGroup && findUser){
            let requests =findGroup.joinRequests?[...findGroup.joinRequests]:[]
            requests.push(userId)
            findGroup.joinRequests =[...requests]
            console.log("AA");
            await findGroup.save()
            
            res.status(200).json({messaage:"Sent request."})
        }else {
            res.status(401).json({messaage:"Something went wrong"})

        }
    } catch (error) {
        res.status(400).json({messaage:error})
        
    }
}

export const allowOrDeleteRequest = async (req,res)=>{
    const {id} =req.params
    const {userId,adminId,allow} =req.body
    
    try {
        const group =await Group.findOne({where:{id}, include:'GroupAdmins'})
        const user = await User.findOne({where:{id:userId}})
        let isAdmin = group.GroupAdmins.find(admin=>admin.userId === adminId)
        // console.log( group.GroupAdmins   );

        if(group && user && isAdmin) {
         let userGroups = user.groups?[...user.groups]:[]
         let groupJoinRequsets = group.joinRequests?[...group.joinRequests]:[]
         let groupMembers = group.members?[...group.members]:[]
         let message =''
         let notifMessage=''
         if(allow){
             userGroups.push(group.id)
             groupMembers.push(user.id)
             groupJoinRequsets =groupJoinRequsets.filter(request=> request!==user.id)
             group.joinRequests =[...groupJoinRequsets]
             group.members = [...groupMembers]
             user.groups= [...userGroups]
            
            message ="Request  allow"
            notifMessage ='accept your join request'
           }else {
            groupJoinRequsets =groupJoinRequsets.map(request=> {return request!==user.id})
            group.joinRequests =[...groupJoinRequsets]
            message ="Request does not allow"
            notifMessage ='denied your join request'

        }
         await group.save()
         await user.save()
         const newNotif = await Notifications.create({
            userId:user.id,
            notificationsDetails:{
                fromWhoId:group.id,
                fromWhoName:group.groupName,
                notifText:`${group.groupName} ${notifMessage} `
            },
            isGroup:true
        })
        res.status(200).json({message})
        }else {
            res.status(401).json({msg:"Somethin went wrong"})
        }
    } catch (error) {
        res.status(400).json({errMsg:error})
    }
}


export const giveAdminPermissionToUser =async (req,res)=>{
    const {id} =req.params
    const {adminId,userId} =req.body

    // console.log("AAA");
    try {
        console.log("AAAA");
        const group =await Group.findOne({where:{id}, include:'GroupAdmins'})
        const user = await User.findOne({where:{id:userId}})
        let isAdmin = null
        let groupAdmins = [...group.admins]
        group.GroupAdmins.filter((admin)=>{
            if(admin.userId === adminId && admin.creator === true) {
                    isAdmin = admin
            }
        })
        if(isAdmin && user){
            const admin = await GroupAdmin.create({
                groupId:group.id,
                userId:user.id,
                creator:false
            })
            groupAdmins.push(admin.id)
            group.admins =[...groupAdmins]
            const newNotif = await Notifications.create({
                userId:user.id,
                notificationsDetails:{
                    fromWhoId:group.id,
                    fromWhoName:group.groupName,
                    notifText:`${group.groupName} made you admin`
                },
                isGroup:true
            })
            await group.save()
            res.status(200).json({admin:admin})
        }else {
            res.status(401).json({message:"Permission not granted or can not find user"})
        }
        

          
    } catch (error) {
        res.status(400).json({msg:error})
        
    }

}


export const destroyAdminPermissionToUser = async (req,res)=>{
    const {id} =req.params
    const {creatorAdmin, destroyAdmin} =req.body

    try {
        const group = await Group.findOne({where:{id}, include:'GroupAdmins'})
        let creator =''
        let allAdmins = []
         group.GroupAdmins.filter(admin=>{
            if(creatorAdmin == admin.userId && admin.creator == true){
                creator = admin
            }
         })
         if ( creator) {
            const groupAdminModel = await GroupAdmin.findOne({where:{groupId:group.id,userId:destroyAdmin}})
             if(groupAdminModel){
                 allAdmins =  group.admins.filter(admin=>admin !==groupAdminModel.id)
                 group.admins =[...allAdmins]
                 await group.save()
                 let destroy = await groupAdminModel.destroy()
                 const newNotif = await Notifications.create({
                    userId:groupAdminModel.userId,
                    notificationsDetails:{
                        fromWhoId:group.id,
                        fromWhoName:group.groupName,
                        notifText:`${group.groupName} removed you from being an admin`
                    },
                    isGroup:true
                })
                 res.status(200).json({message:"User already does not admin",destroy})

             }else {
                res.status(401).json({message:"Group Admin model could not find"})
             }

         }else {
            res.status(401).json({message:"Permission not granted "})

         }

    } catch (error) {
        res.status(400).json({message:error})
    }
}

export const leaveGroup = async (req,res)=>{
    const {id} =req.params
    const {userId} =req.body

    try {
        const group =await Group.findOne({where:{id}})
        const user =await User.findOne({where:{id:userId}})
        if(user && group){
            let userGroups = user.groups.filter(e=>e!==id)
            let groupMembers =group.members.filter(e=>e!==userId)
            let groupAdminsList = [...group.admins]
           const AdminModel = await GroupAdmin.findOne({where:{groupId:id,userId:userId}})

           if(AdminModel){
                let newGroupAdminsList = groupAdminsList.filter(e=>e!==AdminModel.id)
                group.admins =[...newGroupAdminsList]
                await AdminModel.destroy()
           }
           user.groups =[...userGroups]
           group.members =[...groupMembers]
           await user.save()
           await group.save()

           res.status(200).json({message:"You left group"})


        }else {
            res.status(401).json({message:"Something went wrong"})
        }
    } catch (error) {
        res.status(400).json({message:error})
        
    }

}

export const groupPostDelete =async (req,res)=>{

    const {id} =req.params
    const {groupId,adminId} =req.body

    try {
        const post =await Post.findOne({where:{id,groupId},include:'Paragraphs'})
        const group =await Group.findOne({where:{id:groupId},
        include:'GroupAdmins'})

        let isAdmin =''
        group.GroupAdmins.forEach(admin=>{
            if(admin.userId == adminId){
                isAdmin = admin
            }
        })
        if(isAdmin && post){
         let files = []
          
         post.Paragraphs.forEach(e=>{
            if(e.fileUrl){
                files.push(e.fileUrl)
            }
        })

        files.push(post.coverImage)
        const newNotif = await Notifications.create({
            userId:post.userId,
            notificationsDetails:{
                fromWhoId:group.id,
                fromWhoName:group.groupName,
                notifText:`${group.groupName} removed your // ${post.title} post`
            },
            isGroup:true
        })
        await post.destroy()
        fileDelete(files)

        res.status(200).json({message:"Post has deleted by admin"})
        }else{
        res.status(401).json({message:"Post can not deleted. Permission not granted"})

        }
    } catch (error) {
        res.status(400).json({message:err})
    }
}


export const getGroupMembers =async (req,res)=>{

    const {id,pageNumber} =req.params
    let pageSize = 15
    let offset =(pageNumber-1) * pageSize

    try {
        const group = await Group.findOne({where:{id},
            include:[{
                model:GroupAdmin,
                as :'GroupAdmins',
                include:[{
                    model:User,
                    as:'AdminInfo',
                    attributes:['id','first_name','last_name','email','image']
                }]
            }]})
            
            let admins = []
            let  allMembers =[...group.members]
             group.GroupAdmins.forEach(admin=>{
                let newAdmin = {
                    ...admin.dataValues,
                    AdminInfo:{
                        ...admin.AdminInfo.dataValues,
                        isAdmin:true
                    }
                }
                
                admins.push(newAdmin)
             
            })

            
             let adminids = admins.map(admin=>admin.userId)
             let filterMembers =   allMembers.filter(member=>!adminids.includes(member))
            const getMembers = await User.findAll({
                where:{ id:filterMembers },
                attributes:['id','first_name','last_name','email','image'],
                limit:pageSize,
                offset:offset,
            })
            // console.log(getMembers);
            
            let responseData = {
                admins:[],
                members:[]
            }
            
            if(offset == 0){
                responseData.admins =[...admins]
                responseData.members =[...getMembers]
            }else {
                responseData.members =[...getMembers]
            }
            res.status(200).json(responseData)

     }catch (error) {
        res.status(400).json({message:error})
    }
}



export const getGroupPosts = async (req,res)=>{
    const {groupId,pageNumber} =req.params
    const {category, allow} =req.body
    let pageSize = 5
    let offset =(pageNumber-1) * pageSize
    try {
        const groupPosts = await  Post.findAll({where:{groupId:groupId,category:category,permissionShowGroup:allow},
           
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
            ['createdAt', 'DESC'] 
          ],
               limit:pageSize,
                offset:offset,
    })

        res.status(200).json({response:groupPosts})
    } catch (error) {
        res.status(400).json({message:error})
        
    }
}



export const getGroupPostsWaitingAllowed = async (req,res)=>{
    const {groupId,pageNumber} =req.params
    let pageSize = 5
    let offset =(pageNumber-1) * pageSize
    try {
        const groupPosts = await  Post.findAll({where:{groupId:groupId,permissionShowGroup:false},
           
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
            ['createdAt', 'DESC'] 
          ],
               limit:pageSize,
                offset:offset,
    })

        res.status(200).json({response:groupPosts})
    } catch (error) {
        res.status(400).json({message:error})
        
    }
}







export const acceptOrDeniedPost =async (req,res)=>{
    const {id} = req.params
    const {postId,responseAdmin,adminId} =req.body
    try {
        const group =await Group.findOne({where:{id},
            include:'GroupAdmins'})
            
            let isAdmin =''
            group.GroupAdmins.forEach(admin=>{
                if(admin.dataValues.userId == adminId){
                    isAdmin = admin.dataValues
                }
            })
            if(isAdmin){
                const post =await Post.findOne({where:{id:postId,groupId:id}})
                let message =''
                let notifMessage =''
                if(responseAdmin == true){
                    post.permissionShowGroup =true
                    post.requestDenied =false
                    
                    message = 'Post already showed in goup'
                    notifMessage ='group accepted the post of '
                }else {
                    post.permissionShowGroup =false
                    post.requestDenied =true
                    message ='The post was denied.'
                    notifMessage ='group does not  accepted the post of '
                    
                }
                
                const newNotif = await Notifications.create({
                    userId:post.userId,
                    notificationsDetails:{
                        fromWhoId:group.id,
                        fromWhoName:group.groupName,
                        notifText:`${group.groupName} ${notifMessage} // ${post.title}.`
                    },
                    isGroup:true
                })

                await post.save()
                res.status(200).json({message,post})
            }else {
                res.status(401).json({message:'Permission not granted'})
            }

            
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error})
    }
}


export const getGroup  = async (req,res)=>{
    const {id} =req.params

    try {
        const group = await Group.findOne({where:{id},
            include:[{
                model:GroupAdmin,
                as :'GroupAdmins',
                include:[{
                    model:User,
                    as:'AdminInfo',
                    attributes:['first_name','last_name','email']
                }]
            }]})
        console.log(group);
        res.status(200).json(group)
    } catch (error) {
        res.status(400).json({msg:error})
    }
}

