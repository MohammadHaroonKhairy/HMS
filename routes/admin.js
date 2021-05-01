
const express = require('express')
const isAuth =require('../midleware/admin_is_auth');
const admin_contorler  = require('../controllers/admin')
const router = express.Router();

router.get('/admin_dash_bord',isAuth,admin_contorler.admin_dash_bord)

// router.get('/employee_regestration',admin_contorler.employee_regestration)

// router.post('/employee_regestration',admin_contorler.post_employee_regestration)

router.get('/manage_employee',isAuth,admin_contorler.manage_employee)

router.get('/admin_employee_profile',isAuth,admin_contorler.employee_profile)

router.post('/adminEmp_profile',isAuth,admin_contorler.edite_employee_profile)

router.post('/adminChangeEmployeeImage',isAuth,admin_contorler.ChangeemployeeImage)

router.get('/patient_detiels',isAuth,admin_contorler.patient_detiels)

router.get('/specilization',isAuth,admin_contorler.specilizations)

router.post('/specilization',isAuth,admin_contorler.post_specilizations)

router.get('/delete_specilization',isAuth,admin_contorler.delete_specilizations)

router.get('/docotor_appointements_history',isAuth,admin_contorler.doctors_appointement)

router.get('/between_day_report',isAuth,admin_contorler.between_days_report)

router.post('/B_D_report',isAuth,admin_contorler.post_bewtween_days_report)


module.exports = router;