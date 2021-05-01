
module.exports=(req,res,next)=>{
    if(!req.session.empisLoggedIn){
        return res.redirect('/')
    }
    next()
}