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
    res.render('employee/doctor_login',{
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
        return res.status(422).render('employee/doctor_login',{
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
        console.log("user",user[0][0],user[0])
        if(!user[0].length >0){
            return res.status(422).render('employee/doctor_login',{
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
                if(user[0][0].role_type == 'admin'){
                    return res.status(422).render('employee/doctor_login',{
                        pageTitle: 'login',  
                        path: '/login',
                        errormessage:"This is employee's login page",
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
                        req.session.empisLoggedIn = true;
                        req.session.employee = user[0][0];
                        return req.session.save(err=>{
                            console.log(err,"errr")
                            res.redirect('/employee_dash_bord');
                        })    
                     }
                     return res.status(422).render('employee/doctor_login',{
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
    let roles = await Employee.employee_roles()
    let specilizations = await Employee.employee_specilizations()
    let departement   =  await Employee.employee_departement()
    let message=req.flash('error')
    if (message.length>0){
        message= message[0]
    }else{
        message=null
    }
    res.render('admin/employee_regestration',{
        pageTitle: 'SignUp',   
        path: '/patient_sinup',
        errormessage:message,
        haserror: false,
        roles:roles[0],
        specilizations:specilizations[0],
        departement:departement[0],
        oldInput:{
                   full_name : '',
                   province  : '',  
                   district  : '', 
                   home_no   : '',
                   tazkira_number :'',
                   birth_date : '',
                   gender    :  '',
                   doctor_fees :'' ,
                   employee_salary: '',
                   email :'' ,
                   phone : ''
        },
        validationErrors:[]
    })
}




exports.post_sign_up = async (req,res,next)=>{
    console.log('in inini ini ')
        const full_name = req.body.full_name;
        const image  = req.file;
        const province  = req.body.province;
        const district  = req.body.district;
        const home_no   = req.body.home_no;
        const tazkira_number = req.body.tazkira_number
        const birth_date = req.body.birth_date;
        const gender = req.body.gender;
        const departement = req.body.departement;
        const employee_role =req.body.employee_role;
        const employee_job_type =req.body.employee_job_type;
        const employee_fees = req.body.doctor_fees;
        const employee_salary = req.body.employee_salary;
        const employee_email = req.body.email;
        const employee_password = req.body.password;
        const employee_phone    = req.body.phone;
        const added_by  = req.admin.employee_id; // insert the curent user id
        console.log("image" , image)
        if (!image){
            let roles = await Employee.employee_roles()
            let specilizations = await Employee.employee_specilizations()
            let departement   =  await Employee.employee_departement()
            return res.status(422).render('admin/employee_regestration',{
                pageTitle: 'Patient signup',  
                path: '/patient_sinup',
                errormessage:'attached file is not image',
                roles:roles[0],
               specilizations:specilizations[0],
               haserror: true,
               departement:departement[0],
                oldInput:{
                   full_name : full_name,
                   province  : province,  
                   district  : district, 
                   home_no   : home_no,
                   tazkira_number : tazkira_number,
                   birth_date : birth_date,
                   gender    :  gender,
                   doctor_fees :employee_fees ,
                   employee_salary: employee_salary,
                   email :employee_email ,
                   phone : employee_phone
               },
               validationErrors: error.array()
           })
          }
          
          const imageUrl = image.path.split('public\\')[1];
        const error  = validationResult(req);
        if(!error.isEmpty()){
            let roles = await Employee.employee_roles()
            let specilizations = await Employee.employee_specilizations()
            let departement   =  await Employee.employee_departement()
            return res.status(422).render('admin/employee_regestration',{
             pageTitle: 'Patient signup',  
             path: '/patient_sinup',
             errormessage:error.array()[0].msg,
             haserror: true,
             roles:roles[0],
            specilizations:specilizations[0],
            departement:departement[0],
             oldInput:{
                full_name : full_name,
                   province  : province,  
                   district  : district, 
                   home_no   : home_no,
                   tazkira_number : tazkira_number,
                   birth_date : birth_date,
                   gender    :  gender,
                   doctor_fees :employee_fees ,
                   employee_salary: employee_salary,
                   email :employee_email ,
                   phone : employee_phone
            },
            validationErrors: error.array()
        })
       }
       bcrypt.hash(employee_password,12)
       .then(bcryptpassword=>{
        const employee = new Employee
        (
        full_name,
        imageUrl,
        province,  
        district, 
        parseInt(home_no),
        parseInt(tazkira_number),
        birth_date,
        gender ,
        departement,
        employee_role,
        employee_job_type,
        parseInt(employee_fees) ,
        parseInt(employee_salary),
        employee_email ,
        bcryptpassword,
        parseInt(employee_phone),
        added_by
        )

    // saving employee detiels
       employee.save()
    }).then(result=>{
        res.redirect('/admin_dash_bord')
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