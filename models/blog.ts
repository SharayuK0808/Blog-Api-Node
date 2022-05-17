import mongoose from "mongoose";

export const Blog = mongoose.model(
  "Blog",
  new mongoose.Schema({
    title :{
        type : String,
        required : true,
        minlength: 4,
        maxlength:30
    },
    content: {
         type: String,
         minlength:5,
         maxlength:1000,
         required: true 
        },
    author: { 
        type: String,
        minlength:3,
        maxlength:10,
         required: true
        } ,
    comments: [{
            comment_content: {
            type: String,
            minlength:2,
            maxlength:40
            },
            time_posted: {
              type: String,
            },
             
        }],
    published: { 
        type: Boolean,
         default:false
         },
    time_posted: { 
        type: Date,
        default : Date.now 
    },
 
  })
);
