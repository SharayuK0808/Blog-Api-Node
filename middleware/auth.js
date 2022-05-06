const jwt=require('jsonwebtoken');

function auth(req,res,next){

    const token=req.header('x-auth-token');
    if(!token) return res.status(401).send('Access Denied! No token provided');

    try{
        const decoded=jwt.verify(token,'jwtPrivateKey');
        req.user=decoded;
        next();

    }
    catch(ex){
        res.status(400).send('INVALID TOKEN');
    }

}

module.exports = auth;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjY5MTJkNGI4NTllNGI5NTA2YjMxOTEiLCJpYXQiOjE2NTEwNTMyNjl9.JToWsi7kTEKdo54TlRWl6hZYXqJIaF7425L09-iVNp4