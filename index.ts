const express=require('express');
const app=express();
const mongoose=require('mongoose');
const user=require('./routes/user');
const blog=require('./routes/blog');
const auth=require('./routes/auth');

    mongoose.connect('mongodb://localhost/BlogApi')
    .then(()=> console.log(`Connected to DataBase!`))
    .catch(()=> console.log("Couldnt Connect"))


app.use(express.json());


app.use('/user',user);
app.use('/blog',blog);
app.use('/auth',auth);


const server=app.listen(3000,()=>{console.log('Server is listening on port 3000');})
