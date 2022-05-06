export{};
var express = require('express');
const router= express.Router();
const {Blog}=require('../models/blog')
const auth=require('../middleware/auth');
const mongoose=require('mongoose');

router.get('/',auth,async(req:any,res:any)=> {
    const blogs=await Blog.find();
    res.send(blogs);
   
})

router.get('/:id',async(req:any,res:any)=>{

    const blog=await Blog.findById(req.params.id);
    if(!blog)res.status(400).send('Blog with given ID not found');
    res.send(blog);
})

router.post('/',async(req:any,res:any)=>{                            // POST
    
    const { title,content, author,published} = req.body;
    console.log(title,content, author,published);
    let blog=new Blog({title,content,author,published});
    blog=await blog.save();
    res.send(blog);
});

router.put('/:id',async(req:any,res:any) => {           //PUT

     const blog=await Blog.findByIdAndUpdate(req.params.id,{title:req.body.title,content:req.body.content},{new:true})
        if(!blog) {
            res.status(404).send('Blog with given is NOT FOUND.');
        return;
        }
        res.send(blog);

})

router.delete('/:id',async(req:any,res:any) => {    //DELETE
    const blog=await Blog.findByIdAndRemove(req.params.id);
        if(!blog) {
            res.status(404).send('Blog with given is NOT FOUND.');
        return;
        }
        res.send(blog);
})

router.post('/addComment',async(req:any,res:any)=>{                            // POST
    
    const  _id = req.body.id;
    console.log(_id);
    let blog=await Blog.findById(_id)
    console.log(blog);
    if(!blog) return res.status(404).send("Blog with given id is not found");

    var currentdate = new Date();
    var datetime =currentdate.getDay() + "/" + currentdate.getMonth() 
    + "/" + currentdate.getFullYear() + " @ " 
    + currentdate.getHours() + ":" 
    + currentdate.getMinutes() + ":" + currentdate.getSeconds();
    
    await blog.comments.push({
        comment_content: req.body.content,
        time_posted: datetime,
      });
      await blog.save();
      console.log(blog.comments.comment_content,req.body.content);
      res.status(200).send("Comment added successfully");
});


router.delete("/delete/Comment", async (req: any, res: any) => {

    console.log(req.body);
   
    
    console.log(req.body.commentId,req.body.blogId);
      const blog = await Blog.updateOne(
        { _id: req.body.blogId },
        { $pull: { comments: { _id: { $eq: req.body.commentId } } } }
      );
    //   await blog.save();
      if (!blog) return res.status(404).send("Not found");
      res.status(200).send(blog);
   
    }
  );
module.exports =router;