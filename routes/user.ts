export{};
const express=require('express');
const router= express.Router();
const mongoose=require('mongoose');
const {User }=require('../models/user')
const _=require('lodash');
const bcrypt=require('bcrypt');


router.get('/',async(req:any,res:any)=> {

    const users=await User.find();
    res.send(users);
})


router.post('/',async(req:any,res:any)=>{                            // POST
    

   let user=await User.findOne({email:req.body.email})
   if(user) {return res.status(400).send('User is already registered');}

    user=new User({name:req.body.name,
        email:req.body.email,
        isAdmin:req.body.isAdmin,
        password:req.body.password
    })
    const salt=await bcrypt.genSalt(10);
    console.log(salt);
    user.password=await bcrypt.hash(user.password,salt);

    user=await user.save();
   
    const token=user.generateAuthToken();
    
    res.header('x-auth-token',token).send(_.pick(user,['user','email']))
});

module.exports =router;