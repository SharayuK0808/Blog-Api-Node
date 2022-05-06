export{}
const express=require('express');
const router= express.Router();
const mongoose=require('mongoose');
const {User}=require('../models/user')
const _=require('lodash');
const bcrypt=require('bcrypt');
const Joi=require('Joi');
const jwt=require('jsonwebtoken');
// const config=require('config');



router.post('/',async(req:any,res:any)=>{                            // POST
    
  
   let user=await User.findOne({email:req.body.email})
   if(!user) {return res.status(400).send('Invalid Login');}

    const ans=await bcrypt.compare(req.body.password,user.password);
    if(!ans) res.send("Invalid password");

   
    const token=user.generateAuthToken();
    console.log(token);
    res.send(token);
});


module.exports =router;