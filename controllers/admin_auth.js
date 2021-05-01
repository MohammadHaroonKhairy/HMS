const crypto =require('crypto');
const nodemailer=require('nodemailer');
const Employee = require('../models/employee');
const bcrypt = require('bcryptjs');
const {validationResult}=require('express-validator/check')

  

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'mohammadharoonkhairy@gmail.com'
        ,pass:'hahaha'
    }
})

exports.getLogin= (req,res,next)=>{
    // const isloggedin =
    // req.get('Cookie').split('=')[1]   //it is for cookies
    let message=req.flash('error')
    if (message.length>0){
        message= message[0]
    }else{
        message=null
    }
    res.render('admin/admin_login',{
        pageTitle: 'Login',  
        path: '/login',
        errormessage:message,
        haserror: false,
        oldInput:{
            email:'',
            password:''
        },
        validationErrors:[]
    })
} 




exports.postLogin= (req,res,next)=>{
    let message=req.flash('error')
    if (message.length>0){
        message= message[0]
    }else{
        message=null
    }
    const email= req.body.email;
    const password= req.body.password; 
    const error= validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).render('admin/admin_login',{
         pageTitle: 'login',  
         path: '/login',
         errormessage:error.array()[0].msg,
         haserror: true,
         oldInput:{
             email:email, 
             password:password
         },
         validationErrors: error.array()
     })
    }
    console.log("email",email)
    Employee.findByEmail(email)
    .then(user => {
        console.log("user",user[0][0])
        if(!user[0].length >0){
            return res.status(422).render('admin/admin_login',{
                pageTitle: 'login',  
                path: '/login',
                errormessage:message,
                haserror: true,
                oldInput:{
                    email:email,
                    password:password
                },
                validationErrors:[]
            })
                }
                if(user[0][0].role_type !== 'admin'){
                    return res.status(422).render('admin/admin_login',{
                        pageTitle: 'login',  
                        path: '/login',
                        errormessage:"Only admin can login",
                        haserror: true,
                        oldInput:{
                            email:email,
                            password:password
                        },
                        validationErrors:[]
                    })
                }
                bcrypt.
                compare(password,user[0][0].password)
                .then(doMatch=>{
                    if (doMatch){
                        req.session.adisLoggedIn = true;
                        req.session.admin = user[0][0];
                        return req.session.save(err=>{
                            console.log(err,"errr")
                            res.redirect('admin_dash_bord');
                        })    
                     }
                     return res.status(422).render('admin/admin_login',{
                        pageTitle: 'login',  
                        path: '/login',
                        errormessage:'invalid email or passwrod',
                        haserror: true,
                        oldInput:{
                            email:email,
                            password:password
                        },
                        validationErrors:[]
                    })
    })
    .catch(err =>{
        const error = new Error(err);   // created object of error
        error.httpStatusCode= 500;
        return next(error);
      });
})
}






exports.postLogout=(req,res,next)=>{
    req.session.destroy((err)=>{
        console.log(err)
        res.redirect('/')
    }) 

}