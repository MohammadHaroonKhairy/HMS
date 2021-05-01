
const express = require('express')
const isAuth =require('../midleware/is-auth');
const {check, body}=require('express-validator/check')

const Patient = require('../models/patient')
const employee_controler  = require('../controllers/employee'); 
const { values } = require('mysql2/lib/constants/charset_encodings');

const router = express.Router();


router.get('/employee_dash_bord',isAuth,employee_controler.employee_dash_bord)

router.get('/employee_profile',isAuth,employee_controler.employee_profile)

router.post('/employee_profile',isAuth,
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
    })
,employee_controler.edite_doctor_profile)

router.get('/adding_patient',isAuth,employee_controler.Adding_patient)

router.post('/adding_patient',[
    check('room_day')
    .isNumeric()
    .withMessage("please enter a vaild home number")
    .custom((value,{req})=>{    
        const room =req.body.room;  
        console.log(room, vaule , " from router validation ")
         if(room != '0'  ){
            return Promise.reject(' room days is missing!')
         }
    })
    ,
    check('insurance_phone')                           
    .isNumeric()
    .withMessage("please enter a vaild email ")                            
    .custom((value,{req})=>{               
        return Patient.patinet_insurance(value)    
        .then(patientDoc=>{
         if(patientDoc){
            return Promise.reject('Email is alredy in use please enter antor Email')
         }
    })
    })
    ,  
    body('insur_name')        
    .isString()                    
    .isLength({min:2,max:100})
    .withMessage("please enter a vaild name") ,
    check('insur_tin')
    .isNumeric(),
    check('insur_phone')
    .isNumeric(),
    check('insur_email')                           
    .isEmail()
    .withMessage("please enter a vaild email ")                             
    .custom((value,{req})=>{               
        return Patient.patinet_insurance_Byemail(value)    
        .then(patientDoc=>{
         if(!patientDoc[0][0]>0){
            return Promise.reject(' no insurance founded on this number')
         }
    })
    })
    ,  
    check('insur_province')          
    .isString()                   
    .isLength({min:2,max:100})
    .withMessage("please enter a vaild name for province") ,     
    check('insur_district')          
    .isString()                   
    .isLength({min:2,max:100})
    .withMessage("please enter a vaild name for district") ,
    check('insur_home')
    .isNumeric()
    .withMessage("please enter a vaild home number")
    
     
],isAuth,employee_controler.post_adding_patient)
 
router.get('/lab_and_respiy:regs',isAuth,employee_controler.Adding_lab)  

router.post('/lab',isAuth,employee_controler.post_Adding_lab)

router.get('/respiy:regs1',isAuth,employee_controler.Adding_recipy)  

router.post('/recipy',isAuth,employee_controler.post_Adding_recipy)  

router.get('/emp_appointement_history',isAuth,employee_controler.emp_appointement_history)  

router.get('/emp_medicals_history',isAuth,employee_controler.emp_medical_history)  

router.get('/patient_medicals',isAuth,employee_controler.patient_medical_history)  

router.post('/ChangeEmployeeImage',isAuth,employee_controler.ChangeemployeeImage)  

router.get('/empcanceling_appointement',isAuth,employee_controler.postcancel)

router.get('/patietn_insurance',isAuth,employee_controler.patient_insurance)  

module.exports =router
