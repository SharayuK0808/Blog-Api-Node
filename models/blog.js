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
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    comments: [{
            comment_content: {
                type: String,
            },
            time_posted: {
                type: String,
            },
        }],
    published: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
}));
