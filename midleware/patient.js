
module.exports=(req,res,next)=>{
    if(!req.session.patisLoggedIn){
        return res.redirect('/')
    }
    next()
}