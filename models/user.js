"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const res = require('express/lib/response');
const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20,
        unique: true
    },
    password: {
        type: String,
        required: true,
        maxlength: 100,
        minlength: 4
    },
    isAdmin: {
        type: Boolean,
        required: true
    }
});
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    if (!token)
        return 'Token not generted';
    return token;
};
const User = mongoose.model('User', userSchema);
exports.User = User;
