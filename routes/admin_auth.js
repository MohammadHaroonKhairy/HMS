
const express = require('express');
const admin_auth_controler  = require('../controllers/admin_auth')
const router = express.Router();

router.get('/admin_login',admin_auth_controler.getLogin)

router.post('/admin_login',admin_auth_controler.postLogin)

router.get('/admin_logout',admin_auth_controler.postLogout)

module.exports =router