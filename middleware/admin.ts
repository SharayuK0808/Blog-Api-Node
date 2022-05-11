
module.exports=function(req:any,res:any,next:any){
    if(!req.user.isAdmin){
        res.status(403).send('Access denied !');//403-Forbidden
    }
    next();
}