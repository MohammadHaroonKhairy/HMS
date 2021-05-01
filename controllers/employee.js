const Employee   = require('../models/employee')
const Appointement = require('../models/appointement')
const Patient  = require('../models/patient')
const Lab_and_Recipy = require('../models/lab_and_recipy')
const { splice } = require('mysql2/lib/constants/charset_encodings')
const {validationResult}=require('express-validator/check')

const filehelper = require('../util/file')

const item_per_page =5;


exports.employee_dash_bord= (req,res,next)=>{
    console.log("akdjflajdflkjadljflkajdklfjlsdjfslk",req.employee.employee_id)
    Appointement.empfindByStatusandId(req.employee.employee_id)
    .then(([rows, filedDate])=>{
        console.log(rows,"rorororooeoeo")
        res.render('employee/doctor_dash_bord',{
            path: '/employee_dash_bord',
            pageTitle:'Docotr dash bord',
            current_appointement: rows,
            isAuthenticated:req.session.empisLoggedIn,
            employee:req.employee
        })
    })
}

exports.employee_profile = async(req,res,next)=>{
    // get user id
    let roles =  await Employee.employee_roles()
    let specilizations = await Employee.employee_specilizations()
    let departement   =  await Employee.employee_departement()
    Employee.findById(req.employee.employee_id)
    .then(([rows, filedDate])=>{
        res.render('employee/doctor_profile',{
            profile:rows[0],
            errormessage:null,
            pageTitle:'Doctor profile',
            haserror:false,
            specilizations:specilizations[0],
            departement:departement[0],
            roles:roles[0],
            path: '/employee_profile',
            admin:false,
            employee:req.employee,
            isAuthenticated:req.session.empisLoggedIn
        })
        console.log(rows[0]," as this is  for test but noo")
      }).catch(err=>{
        console.log(err)
      })

}


exports.edite_doctor_profile =   async (req,res,next)=>{
    // check patient id for validation
    const employee_id = req.employee.employee_id
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
    console.log(employee_role_id," as birth date")
    const error  = validationResult(req); 
    if(!error.isEmpty()){
      let roles = await Employee.employee_roles()
      let specilizations = await Employee.employee_specilizations()
      let departement   =  await Employee.employee_departement()
      console.log(req.employee,' as employee is not defiend')
      let employee_profile  = await Employee.findById(req.employee.employee_id)
      return res.status(422).render('employee/doctor_profile',{
       pagepageTitle: 'employee_profile',  
       path: '/employee_profile',
       profile:employee_profile[0][0],
       errormessage:error.array()[0].msg,
       haserror: true,
       roles:roles[0],
       admin:false,
       specilizations:specilizations[0],
       departement:departement[0],
       employee:req.employee,
       oldInput:{
       username : full_name,
             province  : province,  
             district  : district, 
             home_no   : home_no,
             tazkira_number : tazkira_number,
             birth_date : birth_date,
             gender    :  gender_id,
             salary: salary,
             departement:departement_id,
             specilization:job_type_id,
             employee_role:employee_role_id,
             email :email ,
             phone_number : phone_number,
             employee_cost:doctor_cost,
             
      },
      validationErrors: error.array()
  })
 }
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
    
    res.redirect("/employee_dash_bord")
)
.catch(err=>{
    console.log(err)
})

}

exports.ChangeemployeeImage = async (req,res,next)=>{
        const image  = req.file;
        console.log("image" , image)
        if (!image){
            return res.status(422).res.redirect('/employee_profile')
          } 
        const imageUrl = image.path.split('public\\')[1];
        Employee.change_photo(req.employee.employee_id,imageUrl)
        .then(()=>{          
          filehelper.deletefile(`public/${req.employee.imageUrl}`)
          res.redirect('/employee_profile')
        })
}


exports.Adding_patient=  async (req,res,next)=>{
        const appointement = await Appointement.fin_by_id(req.query.pat)
        console.log(appointement[0])
        const rooms = await Appointement.room()
        res.render('employee/adding_patient',{
        path: '/adding_patient',
        pageTitle:'regestering patient',
        appointement:appointement[0],
        rooms: rooms[0],
        employee:req.employee,
        isAuthenticated:req.session.empisLoggedIn
        })
}


exports.post_adding_patient= async (req,res,next)=>{
    try {
    const doctor_id = req.employee.employee_id
    const patient_id = req.body.pat;
    const old_insurance_phone  = req.body.insurance_phone;
    const ins_name = req.body.insur_name; 
    const ins_email = req.body.insur_email;
    const ins_image = req.body.insur_image;
    let ins_birth_date = req.body.insur_date;
    const ins_phone = req.body.ins_phone;
    const ins_tin = req.body.insur_tin;
    const ins_province= req.body.insur_province
    const ins_district = req.body.insur_district;
    const ins_home  = req.body.insur_home;
    let room = req.body.room;
    let bed = req.body.bed;
    const room_days = req.body.room_day;
    const pat_sickness = req.body.sickness;
    const old_insurance = await Patient.patinet_insurance(parseInt(old_insurance_phone))
    let old_insurance_id = null;
    if (!old_insurance.length>0){
        old_insurance_id =old_insurance[0][0].id 
        console.log(old_insurance_id) 
        ins_birth_date = null
    }
    if ( room = '0' ){
      room = null
    }

    if(ins_name== ''){
        ins_birth_date = null
    }
    if(!bed>0 && !room>0){
        bed = null
        room= null
    }
    console.log(room)
    const emp = await Employee.add_patient(
        parseInt(patient_id)  ,
        parseInt(doctor_id)  ,
        parseInt(old_insurance_id) ,
        ins_name ,
        ins_image ,
        parseInt(ins_tin)  ,
        ins_birth_date   ,
        parseInt(ins_phone)  ,
        ins_email     ,
        ins_province      ,
        ins_district      ,
        parseInt(ins_home)       ,
        room,
        bed      ,
        parseInt(room_days),
        pat_sickness 
    )
    await  res.redirect(`lab_and_respiy:${emp[0][0].id}?pat=${req.body.appoint_id}`)
    } catch (error) {
        console.log(error)
    }
    

}



exports.Adding_lab=  async (req,res,next)=>{
    const lab_tests = await Lab_and_Recipy.lab_tests()
    const appointement = await Appointement.fin_by_id(req.query.pat)
    res.render('employee/lab',{
    path: '/lab_and_respiy',
    appointement:appointement[0],
    pageTitle:'Add a lab test',
    labs:lab_tests[0],
    regester_id:req.params.regs,
    appoint_id : req.query.pat,
    employee:req.employee,
    isAuthenticated:req.session.empisLoggedIn
    })

}



exports.post_Adding_lab=  async (req,res,next)=>{
    try {
       const regester_id = req.body.regester_id.split(':');
       const appoint_id = req.body.appoint_id;
       console.log(regester_id[1],appoint_id)
       let l1 = req.body.l1;
       const v1 = req.body.v1;
       const i1 = req.body.i1;
       let l2 = req.body.l2;
       const v2 = req.body.v2;
       const i2 = req.body.i2;
       let l3 = req.body.l3;
       const v3 = req.body.v3;
       const i3 = req.body.i3;
       let l4 = req.body.l4;
       const v4 = req.body.v4;
       const i4 = req.body.i4;
       let l5 = req.body.l5;
       const v5 = req.body.v5;
       const i5 = req.body.i5;
       let l6 = req.body.l6;
       const v6 = req.body.v6; 
       const i6 = req.body.i6;
       let l7 = req.body.l7;
       const v7 = req.body.v7;
       const i7 = req.body.i7; 
       let l8 = req.body.l8;
       const v8 = req.body.v8;
       const i8 = req.body.i8;
 
       if(!l1>0){l1= null}
       if(!l2>0){l2= null}
       if(!l3>0){l3= null}
       if(!l4>0){l4= null}
       if(!l5>0){l5= null}
       if(!l6>0){l6= null}
       if(!l7>0){l7= null}
       if(!l8>0){l8= null}
        Lab_and_Recipy.addto_lab( 
            regester_id[1],l1,i1,v1,l2,i2,v2,l3,i3,v3,l4,i4,v4,l5,i5,v5,l6,i6,v6,l7,i7,v7,l8,i8,v8
        )
        
        await  res.redirect(`/respiy:${regester_id[1]}?pat=${appoint_id}`)
    } catch (error) {
        console.log(error)
    }
}






exports.Adding_recipy=  async (req,res,next)=>{
    console.log("thisis is", req.params.regs1.split(':')[1],req.query.pat)
    try {
    const medicines = await Lab_and_Recipy.recipy_items()
    const appointement = await Appointement.fin_by_id(req.query.pat)
    res.render('employee/recipy',{
    path: '/lab_and_respiy',
    appointement:appointement[0],
    pageTitle:'Add recipy',
    recipy:medicines[0],
    regester_id:req.params.regs1,
    appoint_id : req.query.pat,
    employee:req.employee,
    isAuthenticated:req.session.empisLoggedIn
    })
    } catch (error) {
        console.log(error)
    }
    

}


exports.post_Adding_recipy=  async (req,res,next)=>{
    try {
        const regester_id = req.body.regester_id.split(':')[1];
        console.log(regester_id)
        const appoint_id = req.body.appoint_id;
         // get user id;
         let r1 = req.body.r1;
         let q1 = req.body.q1;
         let u1 = req.body.u1;
         let r2 = req.body.r2;
         let q2 = req.body.q2;
         let u2 = req.body.u2;
         let r3 = req.body.r3;
         let q3 = req.body.q3;
         let u3 = req.body.u3;
         let r4 = req.body.r4;
         let q4 = req.body.q4;
         let u4 = req.body.u4;
         let r5 = req.body.r5;
         let q5 = req.body.q5;
         let u5 = req.body.u5;
         let r6 = req.body.r6;
         let q6 = req.body.q6; 
         let u6 = req.body.u6;
         let r7 = req.body.r7;
         let q7 = req.body.q7;
         let u7 = req.body.u7; 
         let r8 = req.body.r8;
         let q8 = req.body.q8;
         let u8 = req.body.u8;
       
       console.log(regester_id ,r1,q1,u1,r2,q2,u2,r3,q3,u3,r4,q4,u4,r5,q5,u5,r6,q6,u6,r7,q7,u7,r8,q8,u8)

       if(!r1>0){r1= null}
       if(!r2>0){r2= null}
       if(!r3>0){r3= null}
       if(!r4>0){r4= null}
       if(!r5>0){r5= null}
       if(!r6>0){r6= null}
       if(!r7>0){r7= null}
       if(!r8>0){r8= null}
       if(!q1>0){q1= null}
       if(!q2>0){q2= null}
       if(!q3>0){q3= null}
       if(!q4>0){q4= null}
       if(!q5>0){q5= null}
       if(!q6>0){q6= null}
       if(!q7>0){q7= null}
       if(!q8>0){q8= null}
       if(!u1>0){u1= null}
       if(!u2>0){u2= null}
       if(!u3>0){u3= null}
       if(!u4>0){u4= null}
       if(!u5>0){u5= null}
       if(!u6>0){u6= null} 
       if(!u7>0){u7= null}
       if(!u8>0){u8= null}
        Lab_and_Recipy.addto_recipy( 
            regester_id,r1,q1,u1,r2,q2,u2,r3,q3,u3,r4,q4,u4,r5,q5,u5,r6,q6,u6,r7,q7,u7,r8,q8,u8
        )
        await  Appointement.set_to(appoint_id,'done')
        await  res.redirect(`/employee_dash_bord`)

    } catch (error) {
        console.log(error)
    }
}



exports.emp_appointement_history= async(req,res,next)=>{
    const page = +req.query.page || 1 ;
    let totalItem;
      Appointement.empfindCountById(req.employee.employee_id).then(res=>{
        console.log("result",res[0][0].total /item_per_page )
        totalItem=res[0][0].total;
      })
    Appointement.empfindById(req.employee.employee_id,item_per_page,(( page - 1 ) * item_per_page))
    .then(([rows, filedDate])=>{
        res.render('employee/appointement_history', {
          appoint: rows,
          path:'/emp_appointement_history',
          employee:req.employee,
          pageTitle:'Docotr appointement history',
          isAuthenticated:req.session.empisLoggedIn,
          curentpage:page,
          hasnextpage: item_per_page * page <totalItem,
          haspreviouspage : page>1 ,
          nextpage:page +1,
          previouspage:page-1,
          lastpage:Math.ceil(totalItem / item_per_page),
          totalItem:totalItem,
          start:( page - 1 ) * item_per_page
        });
      }).catch(err=>{
        console.log(err)
      })
}


exports.emp_medical_history= async (req,res,next)=>{
    const page = +req.query.page || 1 ;
    let totalItem;
    Patient.emppatientCount_lab_test(req.employee.employee_id).then(res=>{
      console.log("result",res[0][0].total /item_per_page )
      totalItem=res[0][0].total;
    })
    Patient.emppatient_lab_test(req.employee.employee_id,item_per_page,(( page - 1 ) * item_per_page))
    .then(([rows, filedDate])=>{
        res.render('employee/medical_history', {
          medicals: rows,
          pageTitle:'Docotr medical history',
          user: req.employee.employee_id,// get user
          path: '/emp_medicals_history',
          employee:req.employee,
          isAuthenticated:req.session.empisLoggedIn,
          curentpage:page,
          hasnextpage: item_per_page * page <totalItem,
          haspreviouspage : page>1 ,
          nextpage:page +1,
          previouspage:page-1,
          lastpage:Math.ceil(totalItem / item_per_page),
          totalItem:totalItem,
          start:( page - 1 ) * item_per_page
        });
      }).catch(err=>{
        console.log(err) 
      })
}



exports.patient_medical_history= async (req,res,next)=>{
    const patient_id = req.query.patient;
    const page = +req.query.page || 1 ;
    let totalItem;
    Patient.patientCount_lab_test(patient_id)
    .then(res=>{
      console.log("result",res[0][0].total /item_per_page )
      totalItem=res[0][0].total;
    })
    let patient = await Patient.findById(patient_id)
    Patient.patient_lab_test(patient_id,item_per_page,(( page - 1 ) * item_per_page))
    .then(([rows, filedDate])=>{
        res.render('employee/patient_medicals', {
          medicals: rows,
          patient:patient[0], 
          employee:req.employee,
          pageTitle:'Patient medicens',
          path: '/emp_medicals_history',
          isAuthenticated:req.session.empisLoggedIn,
          curentpage:page,
          hasnextpage: item_per_page * page <totalItem,
          haspreviouspage : page>1 ,
          nextpage:page +1,
          previouspage:page-1,
          lastpage:Math.ceil(totalItem / item_per_page),
          totalItem:totalItem,
 
          start:( page - 1 ) * item_per_page
        });
      }).catch(err=>{
        console.log(err) 
      })
}


exports.patient_insurance= async (req,res,next)=>{
    const insurance_id = req.query.insurance;
    console.log(insurance_id)
    Patient.fatch_insurances(insurance_id)
    .then(([rows, filedDate])=>{
        res.render('employee/patietn_insur', { 
          insur:rows[0],
          pageTitle:'Patient insurance',
          path: '/medicals_history',
          employee:req.employee,
          isAuthenticated:req.session.empisLoggedIn
        }); 
      }).catch(err=>{
        console.log(err) 
      })   
}


exports.postcancel= (req,res,next)=>{
  const appointement_id = req.query.appoint_id;
  Appointement.set_to(
    appointement_id,'cancel').then(()=>{
     res.redirect('/emp_appointement_history')
  })
}