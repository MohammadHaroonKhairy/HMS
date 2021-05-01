const Appointement = require('../models/appointement')
const Employee = require('../models/employee')
const Admin = require('../models/admin')
const Patient = require('../models/patient')

const filehelper = require('../util/file')

const item_per_page =5;
exports.admin_dash_bord= async (req,res,next)=>{
    // get user id 
        const managers =  await Employee.count_emp_by_role('manger')
        const admins =  await Employee.count_emp_by_role('admin')
        const doctors = await Employee.count_emp_by_departement('doctors')
        const nurses = await Employee.count_emp_by_departement('nurses')
        const lab_and_pharmacy = await Employee.count_emp_by_departement('lab/pharmacy')
        const cleaners = await Employee.count_emp_by_departement('cleaners')
        const report = await Admin.money_report()
        res.render('admin/dash_bord',{
            pageTitle: 'Admin dashbord',  
            path: '/admin_dash_bord',
            report: report[0][0],
            admins:admins[0][0].count,
            managers:managers[0][0].count,
            doctors:doctors[0][0].count,
            nurses:nurses[0][0].count,
            lab_and_pharmacy:lab_and_pharmacy[0][0].count,
            cleaners:cleaners[0][0].count,
            admin : req.admin

        })
}

exports.manage_employee= async (req,res,next)=>{
    let roles = await Employee.employee_roles()
    let specilizations = await Employee.employee_specilizations()
    let departement   =  await Employee.employee_departement()
    const employee = await Employee.findAll()
  
    res.render('admin/mange_employee',{
        path: '/manage_employee',
        pageTitle: 'Employee mangement',  
        employee:employee[0],
        departement:departement[0],
        specilizations:specilizations[0],
        admin : req.admin
    })
}

exports.employee_profile = async(req,res,next)=>{
    // get user id
    let roles =  await Employee.employee_roles()
    let specilizations = await Employee.employee_specilizations()
    let departement   =  await Employee.employee_departement()
    Employee.findById(req.query.emp)
    .then(([rows, filedDate])=>{
        console.log(rows)
        res.render('employee/doctor_profile',{
            profile:rows[0],
            errormessage:null,
            haserror:false,
            pageTitle:'Employee profile',
            specilizations:specilizations[0],
            departement:departement[0],
            roles:roles[0],
            admin:true,
            emp_id:req.query.emp,
            path: '/employee_profile', 
            admin : req.admin
        })
      }).catch(err=>{
        console.log(err)
      })

}


exports.edite_employee_profile =  (req,res,next)=>{
    // check patient id for validation
    const employee_id = req.body.emp_id;
    const full_name = req.body.username;
    const province  = req.body.province;
    const district  = req.body.district;
    const home_no   = req.body.home_no;
    const tazkira_number    = req.body.tazkira_number;
    const birth_date = req.body.birth_date;
    const gender_id = req.body.gender;
    const email = req.body.email;
    const phone_number = req.body.phone_number;
    const departement_id = req.body.departement;
    const job_type_id = req.body.specilization;
    const employee_role_id = req.body.employee_role;
    const doctor_cost = req.body.employee_cost;
    const salary  = req.body.salary;
    console.log(parseInt(employee_id),
    full_name,
    parseInt(tazkira_number),
    parseInt(gender_id),
    birth_date,
    parseInt(departement_id),
    parseInt(employee_role_id),
    parseInt(job_type_id),
    parseInt(doctor_cost),
    parseInt(salary),
    parseInt(phone_number),
    email ,
    province,  
    district, 
    parseInt(home_no)
   )
    
    Employee.update
    (
        parseInt(employee_id),
        full_name,
        parseInt(tazkira_number),
        parseInt(gender_id),
        birth_date,
        parseInt(departement_id),
        parseInt(employee_role_id),
        parseInt(job_type_id),
        parseInt(doctor_cost),
        parseInt(salary),
        parseInt(phone_number),
        email ,
        province,  
        district, 
        parseInt(home_no)
    )
 
.then(
    res.redirect("/manage_employee")
)
.catch(err=>{
    console.log(err)
})

}

exports.ChangeemployeeImage = async (req,res,next)=>{
    const image  = req.file;
    console.log("image" , req.body.emp_id ," jdkjlfadkjflajdlfkjlkdjlkfjdlkjfalkj")
    if (!image){
        return res.status(422).res.redirect('/manage_employee')
      } 
    const imageUrl = image.path.split('public\\')[1];
    console.log(imageUrl, 'as image pleace follow the image url ')
    Employee.change_photo(req.body.emp_id,imageUrl)
    .then(()=>{          
      filehelper.deletefile(`public\\${req.employee.imageUrl}`)
      res.redirect('/manage_employee')
    }).catch(err => console.log(err))
}



// exports.employee_regestration= (req,res,next)=>{
//     res.render('admin/employee_regestration')
// }



// exports.post_employee_regestration =  (req,res,next)=>{

//         const full_name = req.body.full_name;
//         const imageUrl  = "dddsdfsfdsfssdfs"// req.body.imageUrl;
//         const province  = req.body.province;
//         const district  = req.body.district;
//         const home_no   = req.body.home_no;
//         const tazkira_number = req.body.tazkira_number
//         const birth_date = req.body.birth_date;
//         const gender = "male"//req.body.gender;// get gender value from radio input
//         const departement = req.body.departement;
//         const employee_role = "admin" //req.body.employee_role;
//         const employee_job_type = "dentest"//req.body.employee_job_type;
//         const employee_fees = req.body.doctor_fees;
//         const employee_salary = req.body.employee_salary;
//         const employee_email = req.body.email;
//         const employee_password = req.body.password;
//         const confirem_password = req.body.confirem_password
//         const employee_phone    = req.body.phone;
//         const added_by  = null; // insert the curent user id
//         const employee = new Employee
//         (
//         full_name,
//         imageUrl,
//         province,  
//         district, 
//         parseInt(home_no),
//         parseInt(tazkira_number),
//         birth_date,
//         gender ,
//         departement,
//         employee_role,
//         employee_job_type,
//         parseInt(employee_fees) ,
//         parseInt(employee_salary),
//         employee_email ,
//         employee_password,
//         parseInt(employee_phone),
//         added_by
//         )
//     // saving employee detiels
//     employee.save()
//     .then(
//         res.redirect("/admin")
//     )
//     .catch(err=>{
//         console.log(err)
//     })

// }



exports.patient_detiels= async (req,res,next)=>{
    try {
        const page = +req.query.page || 1 ;
        let totalItem;
        Patient.CountAll().then(res=>{
      console.log("result",res[0][0].total /item_per_page )
      totalItem=res[0][0].total;
    })
        const patients = await Patient.fatchAll_forAdmin(item_per_page,(( page - 1 ) * item_per_page))
        res.render('admin/patient_detiels',{
            path:'/patient_detiels',
            pageTitle: 'Patinet detiels',  
            patients:patients[0],
            admin : req.admin,
            curentpage:page,
          hasnextpage: item_per_page * page <totalItem,
          haspreviouspage : page>1 ,
          nextpage:page +1,
          previouspage:page-1,
          lastpage:Math.ceil(totalItem / item_per_page),
          totalItem:totalItem,
          start:( page - 1 ) * item_per_page
    })
    } catch (error) {
        console.log(error)
    }
    
}

exports.specilizations= async (req,res,next)=>{
    try {
        const specilizations = await Admin.spicilization()
    res.render('admin/specilization',{
        path:'/specilization',
        pageTitle: 'Spesclizations',   
        specilizations:specilizations[0],
        admin : req.admin
    })
    } catch (error) {
        console.log(error)
    }
    
}

exports.post_specilizations= async (req,res,next)=>{
    try {
        const name = req.body.name;
        Admin.adding_spicilization(name)
        res.redirect('/specilization')
    } catch (error) {
        console.log(error)
    }
   
}

exports.delete_specilizations= async (req,res,next)=>{
    try {
        const sp_id = req.query.sp_id;
        console.log(sp_id, req.query.sp_id)
        Admin.delete_spicilization(sp_id)
        res.redirect('/specilization')
    } catch (error) {
        console.log(error)
    }
   
}


exports.doctors_appointement= async (req,res,next)=>{
    try {
        const page = +req.query.page || 1 ;
    let totalItem;
      Appointement.Count_All().then(res=>{
        totalItem=res[0][0].total;
      })
        const appointement = await Appointement.find_All(item_per_page,(( page - 1 ) * item_per_page))
        res.render('admin/appointement', {
          appoint: appointement[0],
          path:'/docotor_appointements_history',
          pageTitle: 'Doctors appointement',  
          admin : req.admin,
          curentpage:page,
          hasnextpage: item_per_page * page <totalItem,
          haspreviouspage : page>1 ,
          nextpage:page +1,
          previouspage:page-1,
          lastpage:Math.ceil(totalItem / item_per_page),
          totalItem:totalItem,
          start:( page - 1 ) * item_per_page
        });  
    } catch (error) {
        console.log(error)
    }
}


// exports.doctors_appointement= async (req,res,next)=>{
//     try {
//         const appointement = await Appointement.find_All()
//         res.render('admin/appointement', {
//           appoint: appointement[0],
//           path:'/docotor_appointements_history'
//         });  
//     } catch (error) {
//         console.log(error)
//     }
// }



exports.between_days_report= async (req,res,next)=>{
    try {
        res.render('admin/BD_report', {
          path:'/between_day_report',
          pageTitle: 'Reports',  
          appoint:[],
          first_date:' / / ',
          last_date:' / / ',
          admin : req.admin,
          curentpage:'',
          hasnextpage: '',
          haspreviouspage : '' ,
          nextpage:'',
          previouspage:'',
          lastpage:'',
          totalItem:'',
          start:''
        });  
    } catch (error) {
        console.log(error)
    }
}

exports.post_bewtween_days_report= async (req,res,next)=>{
    try {
        const item = req.body.item;
        const first_date = req.body.first_date;
        const last_date  = req.body.last_date;
        console.log(first_date,last_date)

        const page = +req.query.page || 1 ;
    let totalItem;
      Appointement.Countappointement_B_D_history(first_date,last_date).then(res=>{
        console.log("result",res[0][0].total,"res" )
        totalItem=res[0][0].total;
      })
        const appointement = await Appointement.appointement_B_D_history(first_date,last_date,item_per_page,(( page - 1 ) * item_per_page))
        console.log(totalItem,"this is turning the ")
        res.render('admin/BD_report', {
            path:'/between_day_report',
            pageTitle: 'Reports',  
            appoint:appointement[0][0],
            first_date:first_date,
            last_date:last_date,
            admin : req.admin,
            curentpage:page,
          hasnextpage: item_per_page * page <totalItem,
          haspreviouspage : page>1 ,
          nextpage:page +1,
          previouspage:page-1,
          lastpage:Math.ceil(totalItem / item_per_page),
          totalItem:totalItem,
          start:( page - 1 ) * item_per_page
          });  


    } catch (error) {
        console.log(error)
    }
}

