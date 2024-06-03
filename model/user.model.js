import { Sequelize, DataTypes } from "sequelize";
import db from "../config/db.connect.js";

const User = db.define('users',{
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
    first_name:{
        type:DataTypes.STRING,
        allowNull: false, 
    },
    last_name:{
        type:DataTypes.STRING,
        allowNull: false, 
    },
    phone_number:{
        type:DataTypes.STRING,
        default:null
    },
    googleId:{
        type:DataTypes.STRING,
        unique:true
    },
    email:{
        type:DataTypes.STRING, 
        // allowNull: false, 
        unique: true
    },
    groups:{
        type:DataTypes.ARRAY(DataTypes.STRING),
        default:[]
    },
    password:{
        type:DataTypes.STRING,  
        allowNull: true, 
    },
    image:{
        type:DataTypes.STRING,
        default:null
    },
    job:{
        type:DataTypes.STRING,
        default:null
    },
    savedPosts:{
        type:DataTypes.ARRAY(DataTypes.UUID),
        default:[]
    },
    location:{
        type:DataTypes.STRING,
        default:null
    },
    resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    resetPasswordCode:{
        type:DataTypes.INTEGER,
        allowNull:true    
    },
    confirmed:{
        type:DataTypes.BOOLEAN,
        default:false
    },
    verifyToken:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    verifyTokenExpires: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    createdAt:{
        type:DataTypes.DATE,
        default:Date.now()
    },
    updatedAt:{
        type:DataTypes.DATE,
        default:Date.now()
    }
},
 
)


export default User 