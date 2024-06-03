import express from 'express'
import {  VerifyEmailDoneRegister, destroyUser, editProfileInfo, getUserById, getUserGroups,  register } from '../controller/user.controller.js'
import dotenv from 'dotenv'
import passport from '../config/passport.config.js'
dotenv.config()
const router =express.Router()

router.post('/register',register) 
router.get('/verify-email/:token',VerifyEmailDoneRegister)
router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login-failure' }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL + '/profile');
  }
);
router.get('/google',
  passport.authenticate('google',{ scope: ['profile', 'email'] })
);
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL + '/profile');
  }
);
router.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.redirect('/');
    } 
    res.json(req.user);
  });
  
  router.get('/logout', (req, res) => {
    req.logout(() => {
      res.redirect(process.env.FRONTEND_URL);
    });
  });
  
router.post('/destroy/:id',destroyUser) 
router.post('/editprofile/:id',editProfileInfo) 
router.get('/getuserbyid/:id',getUserById)
router.get('/getusergroups/:id/:pageNumber',getUserGroups)

export default router   