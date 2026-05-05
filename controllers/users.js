const User = require('../models/user.js'); 
module.exports.renderSignupForm = (req,res)=>{
    res.render('users/signup.ejs');
};

module.exports.signup = async (req,res)=>{
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
};

module.exports.renderLoginForm = (req,res)=>{
    res.render('users/login.ejs');
};

module.exports.login = async(req,res)=>{ 
    req.flash('success','Welcome Back!');
    res.redirect(res.locals.redirectUrl || '/listings');
    
};

module.exports.logout = (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success','Logged out successfully!');
        res.redirect('/listings');
    });
};