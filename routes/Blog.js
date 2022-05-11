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
var express = require('express');
const router = express.Router();
const { Blog } = require('../models/blog');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const admin = require('../middleware/admin');
const validateObjId = require('../middleware/validateObjId');
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogs = yield Blog.find();
    res.send(blogs);
}));
router.get('/:id', validateObjId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield Blog.findById(req.params.id);
    if (!blog)
        res.status(400).send('Blog with given ID not found');
    res.send(blog);
}));
router.post('/', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, author, published } = req.body;
    let blog = new Blog({ title, content, author, published });
    blog = yield blog.save();
    res.status(200).send(blog);
}));
router.put('/:id', validateObjId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield Blog.findByIdAndUpdate(req.params.id, { title: req.body.title, content: req.body.content }, { new: true });
    if (!blog) {
        res.status(404).send('Blog with given ID is not found.');
        return;
    }
    res.status(200).send(blog);
}));
router.delete('/:id', [auth, admin, validateObjId], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield Blog.findByIdAndRemove(req.params.id);
    if (!blog) {
        res.status(404).send('Blog with given Id is NOT FOUND.');
        return;
    }
    res.send(blog);
}));
router.post('/comment', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.body.id;
    if (!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send('Invalid Id');
    let blog = yield Blog.findById(_id);
    if (!blog)
        return res.status(404).send("Blog with given id is not found");
    var currentdate = new Date();
    var datetime = currentdate.getDay() + "/" + currentdate.getMonth()
        + "/" + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":" + currentdate.getSeconds();
    yield blog.comments.push({
        comment_content: req.body.content,
        time_posted: datetime,
    });
    yield blog.save();
    res.status(200).send("Comment added successfully");
}));
router.delete("/comment/:id", validateObjId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield Blog.updateOne({ _id: req.body.blogId }, { $pull: { comments: { _id: { $eq: req.params.id } } } });
    if (!blog)
        return res.status(404).send("Not found");
    res.status(200).send(blog);
}));
module.exports = router;
