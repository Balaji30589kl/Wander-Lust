const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectedUrl } = require('../middleware.js');

//rendering the signup form for registering a new user
router.get('/signup',(req,res)=>{
    res.render('users/signup.ejs');
});

//registering a new user
router.post('/signup',wrapAsync(async (req,res)=>{
    try{
        let{username,email,password} = req.body;
        const newUser = new User({
            username,
            email
        });
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser,err=>{
            if(err){
                return next(err);
            }
            req.flash('success','Registered Successfully');
            res.redirect('/listings');
        });
        
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/signup');
    }
}));

//login form 
router.get('/login',(req,res)=>{
    res.render('users/login.ejs');
});


//login route
router.post('/login',saveRedirectedUrl, passport.authenticate('local',{
    failureFlash: true,
    failureRedirect: '/login',
}), async(req,res)=>{
    req.flash('success','Welcome Back!');
    res.redirect(res.locals.redirectUrl || '/listings');
    
});

router.get('/logout',(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success','Logged out successfully!');
        res.redirect('/listings');
    });
});
module.exports = router;