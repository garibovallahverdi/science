import GroupAdmin from "../model/group.admin.model.js";
import Group from "../model/group.model.js";
import Notifications from "../model/notifications.model.js";
import Paragraph from "../model/paragraphs.model.js";
import Post from "../model/post.model.js";
import User from "../model/user.model.js";




export default function defineRelations(db) {
    User.hasMany(Post, { as:"Posts", foreignKey: 'userId', onDelete:'CASCADE' });
    Post.belongsTo(User,{ as:"Creator", foreignKey: 'userId' });
    Group.hasMany(Post,{as:'GroupPosts',foreignKey:'groupId'})
Post.belongsTo(Group,{as:'GroupPost',foreignKey:'groupId'})
Group.hasMany(GroupAdmin,{as:'GroupAdmins',foreignKey:'groupId',onDelete:'CASCADE'})
GroupAdmin.belongsTo(Group,{as:'GroupAdmins',foreignKey:'groupId'})
User.hasMany(GroupAdmin,{as:"AdminInfo",foreignKey:'userId',onDelete:'CASCADE'})
GroupAdmin.belongsTo(User,{as:'AdminInfo',foreignKey:'userId'})
User.hasMany(Notifications,{as:'Notifications',foreignKey:'userId'})
Notifications.belongsTo(User,{as:'Notifications',foreignKey:'userId'})
Post.hasMany(Paragraph,{as:"Paragraphs",foreignKey:'postId',onDelete:'CASCADE'})
Paragraph.belongsTo(Post,{as:"MainPost",foreignKey:'postId'})
}