export{};
const jwt=require('jsonwebtoken');

function auth(req:any,res:any,next:any){

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

