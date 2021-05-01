const crypto =require('crypto');
const nodemailer=require('nodemailer');
const Patient = require('../models/patient');
const bcrypt = require('bcryptjs');
const {validationResult}=require('express-validator/check');

  

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
    res.render('patient/patient_login',{
        pageTitle: 'patient_Login',  
        path: '/patient_Login',
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
        return res.status(422).render('patient/patient_login',{
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
    Patient.patinet_Byemail(email)
    .then(user => {
        console.log("user",user[0][0])
        if(!user[0].length >0){
            return res.status(422).render('patient/patient_login',{
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
                bcrypt.
                compare(password,user[0][0].password)
                .then(doMatch=>{
                    if (doMatch){
                        req.session.patisLoggedIn = true;
                        req.session.patient = user[0][0];
                        return req.session.save(err=>{
                            console.log(err,"errr")
                            res.redirect('/patient_dash_bord');
                        })    
                     }
                     return res.status(422).render('patient/patient_login',{
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





exports.get_sign_up= async (req,res,next)=>{
    let message=req.flash('error')
    if (message.length>0){
        message= message[0]
    }else{
        message=null
    }
    let blood_groups = await Patient.blood_groups();
    res.render('patient/patient_sinup',{
        pageTitle: 'SignUp',   
        path: '/patient_sinup',
        errormessage:message,
        blood_group: blood_groups[0],
        haserror: false,
        oldInput:{
            email:'',
            password:'',
            confirempassword:''
        },
        validationErrors:[]
    })
}




exports.postsignup= async (req,res,next)=>{
        let blood_groups = await Patient.blood_groups();
        const full_name = req.body.full_name;
        const image  = req.file;
        const province  = req.body.province;
        const district  = req.body.district;
        const home_no   = req.body.home_no;
        const blood_group = req.body.blood_group;
        const height    = req.body.height;
        const weghit    = req.body.weghit;
        const birth_date = req.body.birth_date;
        const gender = req.body.gender;
        const married_status = req.body.married_status;
        const email = req.body.email;
        const password = req.body.password;
        const phone    = req.body.phone;
        const error= validationResult(req);

        if(!image){
            return res.status(422).render('patient/patient_sinup',{
             pageTitle: 'Patient signup',  
             path: '/patient_sinup',
             errormessage:error.array()[0].msg,
             blood_group: blood_groups[0],
             haserror: true,
             oldInput:{
               full_name:full_name,
               province: province,  
               district: district, 
               home_no: home_no,
               blood_group :blood_group,
               height : height,
               weghit :weghit,
               birth_date : birth_date,
               gender : gender,
               married_status : married_status,
               email  : email ,
               password : password,
               confirem_password: req.body.comfirm_password,
               phone :phone
             },
             validationErrors: error.array()
         })
        }
        const imageUrl = image.path.split('public\\')[1];
        if(!error.isEmpty()){
     return res.status(422).render('patient/patient_sinup',{
      pageTitle: 'Patient signup',  
      path: '/patient_sinup',
      errormessage:error.array()[0].msg,
      blood_group: blood_groups[0],
      haserror: true,
      oldInput:{
        full_name:full_name,
        province: province,  
        district: district, 
        home_no: home_no,
        blood_group :blood_group,
        height : height,
        weghit :weghit,
        birth_date : birth_date,
        gender : gender,
        married_status : married_status,
        email  : email ,
        password : password,
        confirem_password: req.body.comfirm_password,
        phone :phone
      },
      validationErrors: error.array()
  })
 }
     
      bcrypt.hash(password,12)
     .then(bcryptpassword=>{
        const patient = new Patient
        (
        full_name,
        imageUrl,
        province,  
        district, 
        parseInt(home_no),
        parseInt(blood_group),
        parseInt(height),
        parseInt(weghit),
        birth_date,
        parseInt(gender) ,
        parseInt(married_status),
        email ,
        bcryptpassword,
        parseInt(phone)
        )
         return patient.save()
     }).then(result=>{
         res.redirect('/patient_login')
        return transporter.sendMail({
             to:email,
             from:'mohammadharoonkhairy@gmail.com'
             ,subject:'Signup succeded!',
             html:'<h1> You successfully signed up! </h1>'
         });
     }).catch(err =>{
         const error = new Error(err);   // created object of error
         error.httpStatusCode= 500;
         
       });
 }


 exports.postLogout=(req,res,next)=>{
    req.session.destroy((err)=>{
        console.log(err)
        res.redirect('/')
    }) 

}