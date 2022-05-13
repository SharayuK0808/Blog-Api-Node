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
let server;
const request = require('supertest');
const { Blog } = require('../../models/blog');
const { User } = require('../../models/user');
const mongoose = require('mongoose');
describe('/blog', () => {
    beforeEach(() => {
        server = require('../../index');
    });
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield Blog.remove({});
        yield server.close();
    }));
    const createBlog = () => {
        return new Blog({
            title: 'Node Js',
            author: 'Sushil P',
            content: 'abc xuz'
        });
    };
    describe('/GET', () => {
        it('should return all blogs', () => __awaiter(void 0, void 0, void 0, function* () {
            yield Blog.collection.insertMany([
                { title: 'abcd',
                    author: 'abc',
                    content: 'hjfjdgjdfgjd'
                },
                { title: 'xyzc',
                    author: 'axyz',
                    content: 'fhgf hhgjf'
                }
            ]);
            const res = yield request(server).get('/blog');
            expect(res.status).toBe(200);
        }));
    });
    describe('/GET/:id', () => {
        it('should return a blog if given id is valid', () => __awaiter(void 0, void 0, void 0, function* () {
            const blog = new Blog({
                title: 'Node Js',
                author: 'Sushil P',
                content: 'abc xuz'
            });
            yield blog.save();
            const res = yield request(server).get('/blog/' + blog._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('title', blog.title);
        }));
        it('should return 400 if invalid ID is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request(server).get('/blog/1');
            expect(res.status).toBe(404);
        }));
    });
    describe('/POST', () => {
        beforeEach(() => {
            token = new User().generateAuthToken();
        });
        let token;
        const postReq = () => __awaiter(void 0, void 0, void 0, function* () {
            return request(server)
                .post('/blog')
                .set('x-auth-token', token)
                .send({ title: 'Node Js',
                content: 'abc sd',
                author: 'Sushil',
            });
        });
        it('should return a 401 if client is not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            token = '';
            const res = yield postReq();
            expect(res.status).toBe(401);
        }));
        it('should save and return the blog if logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            yield postReq();
            const blog = Blog.find({ title: 'Node Js',
                content: 'abc sd',
                author: 'Sushil', });
            expect(blog).not.toBeNull();
        }));
    });
    describe('/PUT/:id', () => {
        it('should return 404 if valid Id is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request(server).put('/blog/1');
            expect(res.status).toBe(404);
        }));
        it('should return a 404 if blog with given Id is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request(server).put('/blog/6274c2543455e4d57fccca3h');
            expect(res.status).toBe(404);
        }));
        it('should return a blog if successfully updated', () => __awaiter(void 0, void 0, void 0, function* () {
            let blog = createBlog();
            blog = yield blog.save();
            yield request(server)
                .put('/blog/' + blog._id)
                .send({
                title: 'React JS',
                content: 'react js course'
            });
            const blog2 = Blog.find({ title: 'React JS',
                content: 'react js course', });
            expect(blog2).not.toBeNull();
        }));
    });
    describe("DELETE /:id", () => {
        let token;
        let blog;
        let id;
        const execute = () => __awaiter(void 0, void 0, void 0, function* () {
            return request(server)
                .delete("/blog/deleteBlog/" + id)
                .set("x-auth-token", token)
                .send();
        });
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            blog = new Blog({
                title: "Node Course",
                author: "XYZ",
                content: "Hello.",
            });
            yield blog.save();
            id = blog._id;
            token = new User({ isAdmin: true }).generateAuthToken();
        }));
        it("should return 401 if client is not logged in", () => __awaiter(void 0, void 0, void 0, function* () {
            token = "";
            const res = yield execute();
            expect(res.status).toBe(401);
        }));
        it("should return 403 if the user is not an admin", () => __awaiter(void 0, void 0, void 0, function* () {
            token = new User().generateAuthToken();
            const res = yield execute();
            expect(res.status).toBe(403);
        }));
        it("should return 404 if id is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
            id = 1;
            const res = yield execute();
            expect(res.status).toBe(404);
        }));
        it("should return 404 if no blog with the given id was found", () => __awaiter(void 0, void 0, void 0, function* () {
            id = mongoose.Types.ObjectId();
            const res = yield execute();
            expect(res.status).toBe(404);
        }));
        it("should delete the blog if input is valid", () => __awaiter(void 0, void 0, void 0, function* () {
            yield execute();
            const blogInDb = yield Blog.findById(id);
            expect(blogInDb).toBeNull();
        }));
        it("should return the removed blog", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield execute();
            expect(res.body).toHaveProperty("_id", blog._id.toHexString());
            expect(res.body).toHaveProperty("title", blog.title);
            expect(res.body).toHaveProperty("author", blog.author);
            expect(res.body).toHaveProperty("content", blog.content);
        }));
    });
    describe('POST/comment', () => {
        let blog, token;
        const postCommentReq = () => {
            return request(server)
                .post('/blog/comment')
                .set('x-auth-token', token)
                .send({ id: blog._id, content: 'abc' });
        };
        it('should return 401 if client is not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            token = "";
            blog = createBlog();
            yield blog.save();
            const res = yield postCommentReq();
            expect(res.status).toBe(401);
        }));
        it('should return 200 if comment added successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            token = new User().generateAuthToken();
            blog = createBlog();
            yield blog.save();
            const res = yield postCommentReq();
            expect(res.status).toBe(200);
        }));
    });
    describe('DELETE/comment/:id', () => {
        let commendId, blogId, blog, token;
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            blog = new Blog({
                title: 'React Course',
                author: 'Mosh',
                content: 'Abc ABC',
                comments: [{ comment_content: 'Nice' }],
            });
            yield blog.save();
            blogId = blog._id;
            token = new User().generateAuthToken();
        }));
        const delReq = () => __awaiter(void 0, void 0, void 0, function* () {
            return request(server)
                .delete('/blog/delete/comment/' + commendId)
                .set('x-auth-token', token)
                .send({ blogId: blog._id });
        });
        it('should return 401 if client is not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            token = "";
            const res = yield delReq();
            expect(res.status).toBe(401);
        }));
        it('should return 404 if id is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            commendId = '1';
            const res = yield delReq();
            expect(res.status).toBe(404);
        }));
        it('should return 200 if valid Id is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            commendId = blog.comments[0]._id;
            const res = yield delReq();
            expect(res.status).toBe(200);
        }));
    });
});
