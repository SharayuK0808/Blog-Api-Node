export{};
var express = require('express');
const router= express.Router();
const {Blog}=require('../models/blog')
const auth=require('../middleware/auth');
const mongoose=require('mongoose');
const admin=require('../middleware/admin');
const validateObjId=require('../middleware/validateObjId');

router.get('/',async(req:any,res:any)=> {
    const blogs=await Blog.find();
    res.send(blogs);
   
})

router.get('/:id',validateObjId,async(req:any,res:any)=>{
 
    const blog=await Blog.findById(req.params.id);
    if(!blog)res.status(400).send('Blog with given ID not found');
    res.send(blog);
})

router.post('/',auth,async(req:any,res:any)=>{                            // POST
    const { title,content, author,published} = req.body;
    let blog=new Blog({title,content,author,published});
    blog=await blog.save();
    res.status(200).send(blog);
});

router.put('/:id',validateObjId,async(req:any,res:any) => {           //PUT

     const blog=await Blog.findByIdAndUpdate(req.params.id,{title:req.body.title,content:req.body.content},{new:true})
        if(!blog) {
            res.status(404).send('Blog with given ID is not found.');
        return;
        }
        res.status(200).send(blog);

})

router.delete('/deleteBlog/:id',[auth,admin,validateObjId],async(req:any,res:any) => { 

    const blog=await Blog.findByIdAndRemove(req.params.id);
        if(!blog) return res.status(404).send('cannot fing blog');
         res.status(200).send(blog);
})

router.post('/comment',auth,async(req:any,res:any)=>{                            // POST
    
    const  _id = req.body.id;
    if(!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('Invalid Id');

    let blog=await Blog.findById(_id)
    if(!blog) return res.status(404).send("Blog with given id is not found");

    var currentdate = new Date();
    var datetime = currentdate.toDateString() + ":" + currentdate.toTimeString();
    
    await blog.comments.push({
        comment_content: req.body.content,
        time_posted: datetime,
      });
      await blog.save();
      res.status(200).send("Comment added successfully");
});

router.delete("/delete/comment/:id",[auth,validateObjId], async (req: any, res: any) => {

      const blog = await Blog.updateOne(
        { _id: req.body.blogId },
        { $pull: { comments: { _id: { $eq: req.params.id } } } }
      );
      if (!blog) return res.status(404).send("Not found");
      res.status(200).send(blog);
    
    }
  );
module.exports =router;