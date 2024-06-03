import { Sequelize, DataTypes } from "sequelize";
import db from "../config/db.connect.js";

const GroupAdmin = db.define("groupsadmins",{

    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      groupId:{
        type:DataTypes.UUID,
        allowNull:false
    
      },
      userId:{
        type:DataTypes.UUID,
        allowNull:false
      },
      creator:{
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

export default GroupAdmin