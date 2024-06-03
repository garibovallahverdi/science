import multer from 'multer';
import path from 'path';

// const uploadDir = path.join(__dirname,'/public/blog/images')
const storage =  multer.diskStorage({
    destination: function (req,file,cb){
      if(file.mimetype.split('/')[0]==='image'){
        cb(null,'public/images')
      }
      else if(file.mimetype.split('/')[0]==='application'){

        cb(null,'public/books')
      }
    },
     val : 0,
    filename:function(req,file,cb){
        const uniqueSuffix = Date.now() + "-"+Math.round(Math.random()*1E9)
        const fileExt = path.extname(file.originalname)
        cb(null,file.fieldname + "-" + uniqueSuffix + fileExt)
    }
})

const fileFilter = function(req,file,cb){
    const allowedFileTypesImages = ['image/jpeg','image/jpg','image/png', 'image/gif','application/pdf'];
    if (allowedFileTypesImages.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Desteklenmeyen dosya türü'));
      }
}

const limits = {
    fileSize: 10 * 1024 * 1024 // 10 MB
  };
export const uploadFile = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits
  }).fields([
    {name:"coverImage"},
    {name:"paragraphImages"},
    {name:"profileImage"}
  ]);

 
  export default uploadFile