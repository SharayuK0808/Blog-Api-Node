export{}
const express=require('express');
const router= express.Router();
const mongoose=require('mongoose');
const {User}=require('../models/user')
const _=require('lodash');
const bcrypt=require('bcrypt');
const Joi=require('Joi');
const jwt=require('jsonwebtoken');

router.post('/login',async(req:any,res:any)=>{                            // POST
    
   let user=await User.findOne({email:req.body.email})
   if(!user) {return res.status(400).send('Invalid Login!');}

    const isValid=await bcrypt.compare(req.body.password,user.password);
    if(!isValid) res.send("Invalid Email or Password!");

    const token=user.generateAuthToken();
    res.send(token);
});

module.exports =router;