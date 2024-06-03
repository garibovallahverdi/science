import { Sequelize, DataTypes } from "sequelize";
import db from "../config/db.connect.js";

const Questions = db.define("questions",{
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      }, 
    fullName:{
        type:DataTypes.TEXT,
        allowNull: false, 
    },
    email:{
        type:DataTypes.TEXT,
        allowNull: false, 
    },
    headerContent:{
        type: DataTypes.STRING, 
        allowNull: false, 
        },
    questionText:{
        type:DataTypes.TEXT,
        allowNull: false,
    },
    readed:{
        type:DataTypes.BOOLEAN,
        default:false
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


export default Questions