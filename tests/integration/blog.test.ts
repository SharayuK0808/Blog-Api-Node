export{};
let server:any;
const request=require('supertest');
const {Blog}=require('../../models/blog');
const {User}=require('../../models/user');
const mongoose=require('mongoose');
describe('/blog',()=>{
    beforeEach(()=>{
        server=require('../../index')});

    afterEach(async()=>{
        await Blog.remove({});
        await server.close()});
        
        const createBlog=()=>{
            return new Blog({
                title:'Node Js',
                author:'Sushil P',
                content:'abc xuz'});
        }
    describe('/GET',()=>
    {
        it('should return all blogs',async()=>{

            await Blog.collection.insertMany([
                {title:'abcd',
                author:'abc',
                content:'hjfjdgjdfgjd'
            },
                {title:'xyzc',
                author:'axyz',
                content:'fhgf hhgjf'
            }
            ]);
            const res = await request(server).get('/blog');
            expect(res.status).toBe(200);
        })
    })

    describe('/GET/:id',()=>{
        it('should return a blog if given id is valid',async()=>{
            const blog=new Blog({
                title:'Node Js',
                author:'Sushil P',
                content:'abc xuz'});
            await blog.save();
            const res=await request(server).get('/blog/'+blog._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('title',blog.title);

        })
        it('should return 400 if invalid ID is provided',async()=>{
    
            const res=await request(server).get('/blog/1');
            expect(res.status).toBe(404);
        })
       
    })

    describe('/POST',()=>{
        beforeEach(()=>{
             token=new User().generateAuthToken();
        })
        let token:any;
        const postReq=async()=>{
            return request(server)
            .post('/blog')
            .set('x-auth-token',token)
            .send({title:'Node Js',
                   content:'abc sd',
                   author:'Sushil',
                });
        }
        it('should return a 401 if client is not logged in',async()=>{

            token='';            
            const res=await postReq();
            expect(res.status).toBe(401);
        })
        it('should save and return the blog if logged in',async()=>{
            await postReq();
            const blog=Blog.find({title:'Node Js',
            content:'abc sd',
            author:'Sushil',})

            expect(blog).not.toBeNull();
        })
    })

    describe('/PUT/:id',()=>{
        it('should return 404 if valid Id is not provided',async()=>{
            const res=await request(server).put('/blog/1');
            expect(res.status).toBe(404);
        })
        it('should return a 404 if blog with given Id is not found',async()=>{
            const res=await request(server).put('/blog/6274c2543455e4d57fccca3h');
            expect(res.status).toBe(404);
        })
        it('should return a blog if successfully updated',async()=>{
            let blog=createBlog();
            blog=await blog.save();
               
            await request(server)
            .put('/blog/'+blog._id)
            .send({
                title:'React JS',
                content:'react js course'
            })
            const blog2=Blog.find({title:'React JS',
            content:'react js course',})
            expect(blog2).not.toBeNull();
        })
    })
    
    describe("DELETE /:id", () => {
    let token: any;
    let blog: any;
    let id: any;

    const execute = async () => {
      return  request(server)
        .delete("/blog/deleteBlog/" + id)
        .set("x-auth-token", token)
        .send()
    };

    beforeEach(async () => {
      blog = new Blog({
        title: "Node Course",
        author: "XYZ",
        content:"Hello.",
      });
      await blog.save();
      id = blog._id;
      token = new User({ isAdmin: true }).generateAuthToken();
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await execute();
      expect(res.status).toBe(401);
    });

    it("should return 403 if the user is not an admin", async () => {
      token = new User().generateAuthToken();
      const res = await execute();
      expect(res.status).toBe(403);
    });

    it("should return 404 if id is invalid", async () => {
      id = 1;
      const res = await execute();
      expect(res.status).toBe(404);
    });

    it("should return 404 if no blog with the given id was found", async () => {
      id = mongoose.Types.ObjectId();
      const res = await execute();
      expect(res.status).toBe(404);
    });

    it("should delete the blog if input is valid", async () => {
      await execute();
      const blogInDb = await Blog.findById(id);
      expect(blogInDb).toBeNull();
    });

    it("should return the removed blog", async () => {
      const res = await execute();
      expect(res.body).toHaveProperty("_id", blog._id.toHexString());
      expect(res.body).toHaveProperty("title", blog.title);
      expect(res.body).toHaveProperty("author", blog.author);
      expect(res.body).toHaveProperty("content", blog.content);
    });

  });

    
    describe('POST/comment',()=>{

        let blog:any,token:any;
        const postCommentReq=()=>{
            return request(server)
            .post('/blog/comment')
            .set('x-auth-token',token)
            .send({id:blog._id,content:'abc'})
        }
        it('should return 401 if client is not logged in',async()=>{
             token="";
            blog=createBlog();
            await blog.save();
            const res=await postCommentReq();
            expect(res.status).toBe(401);
            
        })
        it('should return 200 if comment added successfully',async()=>{
             token=new User().generateAuthToken();
             blog=createBlog();
            await blog.save();
            const res=await postCommentReq();
            expect(res.status).toBe(200);
        })
    })

    describe('DELETE/comment/:id',()=>{

        let commendId:any,blogId:any,blog:any,token:any;
        beforeEach(async()=>{
             blog=new Blog({
                title:'React Course',
                author:'Mosh',
                content:'Abc ABC',
                comments:[{comment_content:'Nice'}],
            })
            await blog.save();
            blogId=blog._id;
            token=new User().generateAuthToken();
        })
        const delReq=async()=>{
            return  request(server)
                    .delete('/blog/delete/comment/'+commendId)
                    .set('x-auth-token',token)
                    .send({blogId:blog._id});

        }
        it('should return 401 if client is not logged in',async()=>{
            token="";
            const res=await delReq();
            expect(res.status).toBe(401);
        })
        it('should return 404 if id is invalid',async()=>{
            commendId='1';
            const res=await delReq();
            expect(res.status).toBe(404);
        })
        it('should return 200 if valid Id is provided',async()=>{
    
            commendId=blog.comments[0]._id;
           const res=await delReq();
            expect(res.status).toBe(200);
    
        })
    })
})


