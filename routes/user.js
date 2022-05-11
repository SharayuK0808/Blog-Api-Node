"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { User } = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User.find();
    res.send(users);
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send('User is already registered');
    }
    user = new User({ name: req.body.name,
        email: req.body.email,
        isAdmin: req.body.isAdmin,
        password: req.body.password
    });
    const salt = yield bcrypt.genSalt(10);
    user.password = yield bcrypt.hash(user.password, salt);
    user = yield user.save();
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['user', 'email']));
}));
module.exports = router;
