import { Sequelize, DataTypes,  } from "sequelize";
import db from "../config/db.connect.js";

const Paragraph = db.define('paragraphs',{
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
   
    postId:{
        type:DataTypes.UUID,
        allowNull:false,
    },
    headerText:{
        type:DataTypes.TEXT,
        default:null
    },
    text:{
        type:DataTypes.TEXT,  
        allowNull:false
    },  
    fileUrl : {
        type:DataTypes.STRING,
        default:null
    },
    order:{
        type:DataTypes.INTEGER,
        allowNull:false
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
 

   
 
 
export default Paragraph   