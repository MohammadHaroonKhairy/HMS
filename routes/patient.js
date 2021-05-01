
const express = require('express')
const Patient = require('../models/patient')
const isAuth =require('../midleware/patient');
const {check, body} = require('express-validator/check')
const patient_controler  = require('../controllers/patient')
const router = express.Router();

// patietn  dash bord
router.get('/patient_dash_bord',isAuth,patient_controler.patient_dash_bord)

router.get('/patient_profile',isAuth,patient_controler.patient_profile)

router.post('/edite_patient_profile',isAuth,
check('email')                           
    .isEmail()              
    .withMessage("please enter a vaild email ")  
    .custom((value,{req})=>{               
        return Patient.patinet_Byemail(value)   
        .then(patientDoc=>{
         if(patientDoc[0].length>0){
            return Promise.reject('Email is alredy in use please enter antor Email')
         }
         return true;
    })
    }),
patient_controler.edite_patient_profile)

router.get('/booking_appointement',isAuth,patient_controler.booking_appointemet)

router.get('/updating_appointement',isAuth,patient_controler.getUpdate_appointemet)

router.post('/post_booking_appointement',isAuth,patient_controler.post_booking_appointemet)

router.post('/updating_appointement',isAuth,patient_controler.post_updating_appointemet)

router.get('/canceling_appointement',isAuth,patient_controler.postcancel)

router.post('/ChangePatientImage',isAuth,patient_controler.ChangepatientImage)

router.get('/medicals_history',isAuth,patient_controler.medical_history)

router.get('/appointements_history',patient_controler.appointement_history)



module.exports = router;