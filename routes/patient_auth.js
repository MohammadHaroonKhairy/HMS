
const express = require('express');

const {check, body}=require('express-validator/check')
const Patient = require('../models/patient')
const patient_auth_controler  = require('../controllers/patient_auth')
const router = express.Router();

router.get('/patient_login',patient_auth_controler.getLogin)

router.post('/patient_login',patient_auth_controler.postLogin)

router.get('/patient_sinup',patient_auth_controler.get_sign_up)

router.post('/patient_sinup',
[
    body('full_name')        
    .isString()                   
    .isLength({min:2,max:100})
    .withMessage("please enter a vaild name") ,  
    check('province')          
    .isString()                   
    .isLength({min:2,max:100})
    .withMessage("please enter a vaild name for province") ,     
    check('district')          
    .isString()                   
    .isLength({min:2,max:100})
    .withMessage("please enter a vaild name for district") ,
    check('home_no')
    .isNumeric()
    .withMessage("please enter a vaild home number"),
    check('height')
    .isNumeric()
    .withMessage("please enter a vaild height"),
    check('weghit')
    .isNumeric()
    .withMessage("please enter a vaild weghit"),
    check('email')                           
    .isEmail()
    .withMessage("please enter a vaild email ")                            
    .custom((value,{req})=>{               
        return Patient.patinet_Byemail(value)   
        .then(patientDoc=>{
         if(patientDoc[0].length>0){
            return Promise.reject('Email is alredy in use please enter antor Email')
         }
    })
    }),
        check("password")           
        .isLength({min:5, max:10})   
        .trim()
        .withMessage('password should be  between  5 to 10 charecters '),
    
        body("comfirm_password")     //  set validation for input named  con_password
        .trim()
        .custom((value,{req})=>{
            if(value!== req.body.password){
                return Promise.reject('password dose not mactched')
            }
            return true;
        }),
    check('phone')
    .isNumeric(),
],
patient_auth_controler.postsignup)


router.get('/patient_logout',patient_auth_controler.postLogout)

module.exports =router