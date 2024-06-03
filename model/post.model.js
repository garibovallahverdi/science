import { Sequelize, DataTypes, UUID, UUIDV4 } from "sequelize";
import db from "../config/db.connect.js";
import slugify from "slugify";


const Post = db.define('posts',{
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
    slug:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    view:{
        type:DataTypes.INTEGER,
        default:0
    },
    userId:{
        type:DataTypes.UUID,
        allowNull:false,
    },
    groupId:{
        type:DataTypes.UUID,
        default:null
    },
    permissionShowGroup:{
        type:DataTypes.BOOLEAN,
        default:false
    },
    requestDenied:{
        type:DataTypes.BOOLEAN,
        default:false
    },
    title:{
        type:DataTypes.TEXT,
        allowNull:false,
        set(value){
            this.setDataValue('title',value)
            this.setDataValue('slug',slugify(value + this.id,{lower:true}))
        }
    },
  
    coverImage:{
        type:DataTypes.STRING,
        default:null
    },
    category:{
        type:DataTypes.STRING,  
        default:null
    },  
   
    createdAt:{
        type:DataTypes.DATE,
        default:Date.now()
    },
    updatedAt:{
        type:DataTypes.DATE,
        default:Date.now()
    }
}) 

   
 
 
export default Post   