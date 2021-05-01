
module.exports=(req,res,next)=>{
    if(!req.session.adisLoggedIn){
        return res.redirect('/')
    }
    next()
}