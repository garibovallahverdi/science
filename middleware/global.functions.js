import fs from 'fs'
import User from '../model/user.model.js'
import { Op } from 'sequelize'
const imagePath = 'public/images/'
const bookPath = 'public/books/'


export const fileDelete = (files)=>{
  let  imageFileTypes = ['jpeg', 'png', 'gif','jpg']
    let boksFileTypes = ['pdf']
    let path = ''
    files.forEach(file=>{
        // console.log(file);
        let fileType = file.split('.')
        if(imageFileTypes.includes(fileType[fileType.length-1])){
            path = imagePath
        }
        if(boksFileTypes.includes(fileType[fileType.length-1])){
            path = bookPath
        }
        let dirName = path+file
        fs.unlink(dirName,(err)=>{
            if(err){
               
                return err
            }
            console.log("File has deleted..");
        })
    })

}

export const chekUnConfirmedUser = async () => {
    const oneMinuteAgo  = new Date();
    console.log("user cleaner");
oneMinuteAgo .setMinutes(oneMinuteAgo.getDate() - 1);
    try {
        const result = await User.destroy({
            where: {
                confirmed: false,
                createdAt: {
                    [Op.lt]: oneMinuteAgo
                }
            } 
        });

        console.log(`Deleted ${result} users`);
    } catch (error) {
        console.error('Error deleting users:', error);
    }
}