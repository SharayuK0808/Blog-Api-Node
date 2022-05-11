"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.Blog = mongoose_1.default.model("Blog", new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 30
    },
    content: {
        type: String,
        minlength: 5,
        maxlength: 1000,
        required: true
    },
    author: {
        type: String,
        minlength: 3,
        maxlength: 10,
        required: true
    },
    comments: [{
            comment_content: {
                type: String,
                minlength: 2,
                maxlength: 40
            },
            time_posted: {
                type: String,
            },
        }],
    published: {
        type: Boolean,
        default: false
    },
    time_posted: {
        type: Date,
        default: Date.now
    },
}));
