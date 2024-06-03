import { Sequelize, DataTypes, } from "sequelize";
import db from "../config/db.connect.js";

const Notifications = db.define('notifications',{
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      userId:{
        type:DataTypes.UUID,
        allowNull:false
      },
      notificationsDetails:{
        type:DataTypes.JSONB,
        allowNull:false
    },
    isGroup:{
        type:DataTypes.BOOLEAN,
        allowNull:false
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
 

 
export default Notifications   