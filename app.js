const path = require('path');

const Employee = require('./models/employee')
const Patient = require('./models/patient')
const express = require('express');
const bodyParser = require('body-parser');
const session= require('express-session')
const MySQLStore = require('express-mysql-session')(session);
const flash = require('connect-flash');
const errorController = require('./controllers/error');
const multer = require('multer')
const app = express();

let Store = new MySQLStore({
    host:'localhost',
    port: 3306,
    user:'root',
    password:'haroon123', 
    database: 'mhk'
	
});


const filestorage = multer.diskStorage({ // diskStorage is a storage engine tha can hold tow values 1: destenision  2: file name .
    destination:(req,file,cb)=>{ // it is a functaion that control fils storage place  
        cb(null, 'public/images/employee')
    },
    filename:(req,file,cb)=>{    // it is a functaion that  control the file name.
        var date = Math.floor((Math.random()*100000000000)+1)
        cb(null, date.toString() + '-' + file.originalname);
    }
})

const Patfilestorage = multer.diskStorage({ 
    destination:(req,file,cb)=>{ // it is a functaion that control fils storage place  
        cb(null, 'public/images/patients')
    },
    filename:(req,file,cb)=>{    // it is a functaion that  control the file name.
        var date = Math.floor((Math.random()*10000000000)+1)
        cb(null, date.toString() + '-' + file.originalname);
    }
})

const filefilter = (req, file , cb)=>{ // it is incoming file filter 
    if(
        file.mimetype === 'image/jpg' || 
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpeg'
    ){
        cb (null, true)
    }else{
        cb ( null, false)
    }
}


app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage: filestorage , fileFilter: filefilter},).single('empimage'))
// app.use(multer({storage: Patfilestorage , fileFilter: filefilter}).single('patimage'))
app.use(express.static(path.join(__dirname, 'public')));



const home_pageRoutes = require('./routes/home_page');
const admin_routes = require('./routes/admin')
const admin_auth_routes = require('./routes/admin_auth');
const employee_routes = require('./routes/employee')
const patient_routes = require('./routes/patient')
const patient_auth_routes = require('./routes/patient_auth')
const employee_auth_routes = require('./routes/employee_auth');


app.use(
    session({secret:" my secret",resave:false, saveUninitialized:false,store:Store})
)
app.use(flash());


// getting admin data
app.use( (req,res,next)=>{
    if(!req.session.admin){
        return next()
    }

    Employee.findById(req.session.admin.employee_id)
    .then(user=>{
        if(!user){
            return next();
        }
        req.admin= user[0][0];
        next() 
    }).catch( err=>{
        next( new Error(err))
    })
 })

 // getting employee data
app.use( (req,res,next)=>{
    if(!req.session.employee){
        return next()
    }

    Employee.findById(req.session.employee.employee_id)
    .then(user=>{
        if(!user){
            return next();
        }
        req.employee= user[0][0];
        next() 
    }).catch( err=>{
        next( new Error(err))
    })
 })

app.use( (req,res,next)=>{
    if(!req.session.patient){
        return next()
    }

    Patient.findById(req.session.patient.patient_id)
    .then(user=>{
        if(!user){
            return next();
        }
        req.patient= user[0][0];
        next() 
    }).catch( err=>{
        next( new Error(err))
    })
 })


app.use(admin_auth_routes)
app.use(home_pageRoutes);
app.use(admin_routes)
app.use(employee_auth_routes)
app.use(employee_routes)
app.use(patient_auth_routes)
app.use(patient_routes)
app.use(errorController.get404);





app.listen(2000);