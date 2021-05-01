
const express = require('express');
const Employee = require('../models/employee')
const {body, check}=require('express-validator/check')
const employee_auth_controler  = require('../controllers/employee_auth');

const { values } = require('mysql2/lib/constants/charset_encodings');

const router = express.Router();

router.get('/doctor_login',employee_auth_controler.getLogin)

router.post('/doctor_login',employee_auth_controler.postLogin)

router.get('/employee_regestration',employee_auth_controler.get_sign_up)

router.post('/employee_regestration',
[
    body('full_name')        
    .isString()                   
    .isLength({min:2,max:100})
    .withMessage("please enter a vaild name") ,
    body("birth_date")     
    .custom((value,{req})=>{
        const age = new Date().getFullYear() - new Date(value).getFullYear()
        if(age < 15 ){
            return Promise.reject('too young for this job ')
        }
        else if(age > 80 ){
            return Promise.reject('tooo old for this job  ')
        }
        return true;
    }),
    body("employee_role")     //  set validation for input named  con_password
    .custom((value,{req})=>{
        if(parseInt(value) ===0 ){
            return Promise.reject('please select roll for employee')
        }
        return true;
    }),
    // body("employee_job_type")     
    // .custom((value,{req})=>{
    //     const departement = req.body.departement;
    //     if (parseInt(departement)  =! 1 ){
    //         return Promise.reject('  Only doctors have Specilization.')
    //     }
    //     return true;
        
    // })
    // ,
    body('province')          
    .isString()                   
    .isLength({min:2,max:100})
    .withMessage("please enter a vaild name for province") ,     
    body('district')          
    .isString()                   
    .isLength({min:2,max:100})
    .withMessage("please enter a vaild name for district") ,
    body('home_no')
    .isNumeric()
    .withMessage("please enter a vaild home number"),
    body('tazkira_number')
    .isNumeric()
    .withMessage("please enter a vaild tazkira_number"),
    check('email')                           
    .isEmail()              
    .withMessage("please enter a vaild email ")  
    .custom((value,{req})=>{               
        return Employee.findByEmail(value)      // findOne is a filtering function
        .then(userDoc=>{
         console.log(userDoc[0])
         if(userDoc[0].length >0){
            return Promise.reject('Email is alredy in use please enter antor Email')
         }
         return true;
    })
    }),
        body("password")           
        .isLength({min:5, max:10})   
        .trim()
        .withMessage('password should be  between  5 to 10 charecters '),
    
    body("confirem_password")     //  set validation for input named  con_password
    .trim()
    .custom((value,{req})=>{
        if(value!== req.body.password){
            return Promise.reject('password dose not mactched')
        }
        return true;
    }),
    body('phone')
    .isLength({min:10, max:13})   
    .isNumeric()
    .withMessage('phone number is not valid '),
    
],
employee_auth_controler.post_sign_up)

router.get('/logout',employee_auth_controler.postLogout)
module.exports =router