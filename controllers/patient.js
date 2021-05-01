const Patient = require('../models/patient')
const Appointement = require('../models/appointement')
const Employee = require('../models/employee')
 
const filehelper = require('../util/file')

const item_per_page =5;

exports.patient_dash_bord= (req,res,next)=>{
    // console.log(req.patient.patient_id,"djlkfa;sfa;djflkadjfa;jdlkjalkdjfldjflkfjafkldj")
    Appointement.findByStatusandId(req.patient.patient_id)
    // Appointement.findByStatusandId(1)
    .then(([rows, filedDate])=>{
        res.render('patient/patient_dash_bord',{
            pageTitle:'Patient dashbord',
            path: '/patient_dash_bord',
            current_appointement: rows,
            patient:req.patient
        })
    })
}


exports.patient_profile = async (req,res,next)=>{
    let blood_groups = await Patient.blood_groups();
    Patient.findById(req.patient.patient_id)
    .then(([rows, filedDate])=>{
        console.log(rows)
        res.render('patient/patient_profile',{
            profile:rows[0],
            pageTitle:'Patient profile',
            blood_group: blood_groups[0],
            path: '/patient_profile',
            patient:req.patient
        })
      }).catch(err=>{
        console.log(err)
      })
}


exports.edite_patient_profile =  (req,res,next)=>{
    const patient_id = req.patient.patient_id 
    const full_name = req.body.name;
    const province  = req.body.province;
    const district  = req.body.district;
    const home_no   = req.body.home_no;
    const blood_group = req.body.blood_group;
    const height    = req.body.height;
    const weghit    = req.body.weghit;
    const birth_date = req.body.birth_date;
    const gender = req.body.gender;
    const married_status = req.body.married_status;
    const email = req.body.email;
    const phone    = req.body.phone_number;
   
    Patient.update
    (
        parseInt(patient_id),
        full_name,
        parseInt(gender ),
        birth_date,
        parseInt(height), 
        parseInt(weghit),
        parseInt(married_status), 
        parseInt(blood_group),
        parseInt(phone),
        email ,
        province,  
        district, 
        parseInt(home_no)
    )
.then(
    res.redirect("/patient_profile")
)
.catch(err=>{
    console.log(err)
})

}

exports.ChangepatientImage = async (req,res,next)=>{
  const image  = req.file;
  console.log("image" , image,"as image ................")
  if (!image){
      return res.status(422).res.redirect('/patient_profile')
    } 
  const imageUrl = image.path.split('public\\')[1];
  console.log(req.patient.patient_id)
  Patient.change_photo(req.patient.patient_id,imageUrl)
  .then(()=>{          
    filehelper.deletefile(`public/${req.patient.imageUrl}`)
    res.redirect('/patient_profile')
  })
}


exports.booking_appointemet=  async(req,res,next)=>{
    let doctors = await Employee.findAll()
    Employee.employee_specilizations()
    .then(([rows, filedDate])=>{
        res.render('patient/appointement', {
          specilizations: rows,
          editing:false,
          appointement:'',
          employee :doctors[0],
          path: '/booking_appointement',
          pageTitle:'Booking appointement',
          patient:req.patient
        })
      })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
}

exports.getUpdate_appointemet=  async(req,res,next)=>{
  const appointement_id = req.query.appoint_id;
  let appointement = await Appointement.fin_by_id(appointement_id)
  let doctors = await Employee.findAll()
  Employee.employee_specilizations()
  .then(([rows, filedDate])=>{
      res.render('patient/appointement', {
        specilizations: rows,
        editing:true,
        employee :doctors[0],
        pageTitle:'updatting appoitement',
        path: '/updating_appointement',
        appointement:appointement[0][0],
        patient:req.patient
      })
    })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
}


exports.post_updating_appointemet= (req,res,next)=>{
  const appointement_id = req.body.appoint_id;
  const employee = req.body.employee;
  const date = req.body.date;
  const time = req.body.time;
  console.log(date)
  Appointement.updating(
    appointement_id,
    employee,
    date,
    time
  ).then(()=>{
     res.redirect('/appointements_history')
  })
}

exports.postcancel= (req,res,next)=>{
  const appointement_id = req.query.appoint_id;
  Appointement.set_to(
    appointement_id,'cancel').then(()=>{
     res.redirect('/appointements_history')
  })
}

exports.post_booking_appointemet= (req,res,next)=>{
     const patient = req.patient.patient_id;
     const employee = req.body.employee;
     const date = req.body.date;
     const time = req.body.time;
     Appointement.booking(
       employee,
       patient,
       date,
       time
     ).then(()=>{
        res.redirect('/appointements_history')
     })
}




exports.appointement_history=(req,res,next)=>{
  const page = +req.query.page || 1 ;
  let totalItem;
    Appointement.findCountById(req.patient.patient_id).then(res=>{
      console.log("result",res[0][0].total /item_per_page )
      totalItem=res[0][0].total;
    })
    console.log("result2",item_per_page,(( page - 1 ) * item_per_page) )
    Appointement.findById(req.patient.patient_id,item_per_page,(( page - 1 ) * item_per_page))
    .then(([rows, filedDate])=>{
        console.log(rows) 
        res.render('patient/appointement_history', {
          appoint: rows,
          patient:req.patient,
          pageTitle:'Patient appointement history',
          path:'/appointements_history',
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

exports.medical_history= async (req,res,next)=>{
  const page = +req.query.page || 1 ;
  let totalItem;
    Patient.patientCount_lab_test(req.patient.patient_id).then(res=>{
      console.log("result",res[0][0].total /item_per_page )
      totalItem=res[0][0].total;
    })
    Patient.patient_lab_test(req.patient.patient_id,item_per_page,(( page - 1 ) * item_per_page))
    .then(([rows, filedDate])=>{
        console.log(rows)
        res.render('patient/medical_history', {
          medicals: rows,
          pageTitle:'Patient medical history',
          path: '/medicals_history',
          curentpage:page,
          hasnextpage: item_per_page * page <totalItem,
          haspreviouspage : page>1 ,
          nextpage:page +1,
          previouspage:page-1,
          lastpage:Math.ceil(totalItem / item_per_page),
          totalItem:totalItem,
          start:( page - 1 ) * item_per_page,
          patient:req.patient
        });
      }).catch(err=>{
        console.log(err) 
      })
}