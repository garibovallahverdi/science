import express from "express"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import UserRouter from "./router/user.router.js"
import PostRouter from './router/post.router.js'
import QuestionRouter from './router/question.router.js'
import GroupRouter from './router/group.router.js'
import ResetRouter from './router/reset.router.js' 
import SearchRouter from './router/search.router.js'
import cors from 'cors'
import db from "./config/db.connect.js"
import { chekUnConfirmedUser } from "./middleware/global.functions.js"
import defineRelations from "./middleware/models.relations.js"
import session from "express-session"
import passport from "passport"
dotenv.config()
const app =express()
app.use(bodyParser.json({limit:"60mb"}))
app.use(bodyParser.urlencoded({limit:"60mb",extended:true}))
app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
     saveUninitialized: true,
     cookie: { secure: false } //
  }));
  app.use(passport.initialize());
app.use(passport.session());

app.use('/auth',UserRouter)
app.use('/post',PostRouter) 
app.use('/reset',ResetRouter) 
app.use('/search',SearchRouter) 
app.use('/question',QuestionRouter)
app.use('/group',GroupRouter)

setInterval(chekUnConfirmedUser, 60 * 60 * 1000);




defineRelations(db)
app.listen(process.env.PORT,async ()=>{
    console.log(`Server is runing at port ${process.env.PORT}`);
    try {
        await db.authenticate()
        db.sync({
            // force:true   
        }).then(()=>{  
            console.log("Sync");
        }) 
        console.log("Database connection succesfull");
    } catch (error) {
        console.log(error);
    }
})


; 