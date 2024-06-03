import { Sequelize, DataTypes } from "sequelize";
import db from "../config/db.connect.js";

const Group = db.define("groups",{

    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      groupName:{
        type:DataTypes.STRING,
        allowNull:false,
      },
      admins:{
        type: DataTypes.ARRAY(DataTypes.STRING), 
        default:[],
      },
      groupInfo:{
        type:DataTypes.STRING,
        default:null,
      },
      groupImage:{
        type:DataTypes.STRING,
        default:null
      },
  
      joinRequests:{
        type: DataTypes.ARRAY(DataTypes.STRING), 
        default:[],
    },
    
     members:{
        type: DataTypes.ARRAY(DataTypes.STRING), 
        default: [],
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

export default Group