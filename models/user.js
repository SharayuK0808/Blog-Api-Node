"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const res = require('express/lib/response');
const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// const config=require('config');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
    },
    email: {
        type: String,
        required: true,
        minlength: 2,
        unique: true
    },
    password: {
        type: String,
        required: true,
        maxlength: 1024
    },
    isAdmin: {
        type: Boolean,
        required: true
    }
});
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, 'jwtPrivateKey');
    if (!token)
        return 'token not generted';
    return token;
};
const User = mongoose.model('User', userSchema);
exports.User = User;
