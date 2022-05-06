import mongoose from "mongoose";

export const Blog = mongoose.model(
  "Blog",
  new mongoose.Schema({
    title :{
        type : String,
        required : true,
        minlength: 4,
    },
    content: {
         type: String,
         required: true 
        },
    author: { 
        type: String,
         required: true
        } ,
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
         default:false
         },
    timestamp: { 
        type: Date,
        default : Date.now 
    },
 
  })
);
