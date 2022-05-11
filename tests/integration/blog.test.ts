export{};
let server:any;
const request=require('supertest');
const {Blog}=require('../../models/blog');
const {User}=require('../../models/user');
describe('/blog',()=>{
    beforeEach(()=>{server=require('../../index')});
    afterEach(async()=>{
        await Blog.remove({});
        await server.close()});
        
        const createBlog=()=>{
            return new Blog({
                title:'Node Js',
                author:'Sushil P',
                content:'abc xuz'});
        }
    describe('/get',()=>
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

    describe('/get/:id',()=>{
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

    describe('/post',()=>{
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

    describe('/put/:id',()=>{
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
    
    describe('POST/comment',()=>{
        it('should return 200 if comment added successfully',async()=>{
            const blog=createBlog();
            await blog.save();
            const res=await request(server)
                      .post('/blog/comment')
                      .send({id:blog._id})

            expect(res.status).toBe(200);
        })
    })

    

})