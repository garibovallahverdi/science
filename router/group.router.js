import express from 'express'
import { acceptOrDeniedPost, allowOrDeleteRequest, createGroup, destroyAdminPermissionToUser, getGroup, getGroupMembers, getGroupPosts, giveAdminPermissionToUser, groupPostDelete, leaveGroup, sendJoinRequestToGroup } from '../controller/group.controller.js'
const router = express.Router()

router.post('/create', createGroup )

router.get('/getgroup/:id', getGroup)
router.post('/sendjoinrequests/:id', sendJoinRequestToGroup)
router.post('/alloworedelete/:id', allowOrDeleteRequest)
router.post('/givepermissiontouser/:id', giveAdminPermissionToUser)
router.post('/destroypermissiontouser/:id', destroyAdminPermissionToUser)
router.post('/leavegroup/:id', leaveGroup)
router.post('/deletegrouppost/:id',groupPostDelete)
router.get('/getmembers/:id/:pageNumber',getGroupMembers)
router.get('/getgroupposts/:groupId/:pageNumber',getGroupPosts)
router.get('/getgroupposts-waitingallowed/:groupId/:pageNumber',getGroupPosts)
router.post('/acceptordeniedgrouppost/:id',acceptOrDeniedPost)


export default router  