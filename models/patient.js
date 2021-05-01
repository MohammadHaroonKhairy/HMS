const db = require('../util/database')

module.exports =  class Patient {
    constructor(
        full_name,
        imageUrl,
        province,  
        district, 
        home_no,
        blood_group,
        height,
        weghit,
        birth_date,
        gender ,
        married_status,
        email ,
        password,
        phone,
         )
        
        {
            this.full_name = full_name
            this.imageUrl  = imageUrl
            this.province  = province
            this.district  = district
            this.home_no   = home_no
            this.blood_group= blood_group
            this.height    = height
            this.weghit    = weghit
            this.birth_date= birth_date
            this.gender    = gender
            this.married_status = married_status
            this.email     =  email
            this.password  = password
            this.phone     = phone
    }
    save(){
        return db.execute("call mhk.patient_regestration(?,?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?);"
 ,
        [
            this.full_name,
            this.imageUrl,
            this.gender ,
            this.birth_date,
            this.height,
            this.weghit, 
            this.married_status,
            this.blood_group,
            this.phone,
            this.email ,
            this.province,  
            this.district, 
            this.home_no,
            this.password
            
        ]
        )
    }

    static update( patient_id,
        full_name,
        gender ,
        birth_date,
        height,
        weghit,
        married_status,
        blood_group,
        phone,
        email ,
        province,  
        district, 
        home_no){
        return db.execute("call mhk.patient_updateion(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
 ,
        [
            patient_id,
            full_name,
            gender ,
            birth_date,
            height,
            weghit,
            married_status,
            blood_group,
            phone,
            email ,
            province,  
            district, 
            home_no
            
        ]
        
        )
    }

    static change_photo(pat_id, imageUrl){
        return db.execute('call mhk.change_pat_image(?,?);',[pat_id,imageUrl])  
        }  

    static CountAll(){
        return db.execute('SELECT count(patient_id) as total FROM mhk.patient_detiels')  
        }   
    static fatchAll_forAdmin(limit, offset){
        return db.execute(`SELECT * FROM mhk.patient_for_admin  limit ${limit} offset ${offset}`)
        }
    
        static fatchAll(){
            return db.execute(`SELECT * FROM mhk.patient_detiels;`)
            }

    static findById(id) {
        return db.execute('SELECT * FROM mhk.patient_detiels where patient_id=?',[id])
    }  

     static patient_medicals(id){
    return db.execute('SELECT * FROM mhk.medical_history ')  
}   

    static Countpatient_medicals(id){
    return db.execute('SELECT count(Regestration_id) as total FROM mhk.medical_history ')  
    }   


    static patientCount_lab_test(id){
        return db.execute('SELECT count(Regestration_id) as total FROM mhk.medical_history where patient_id=?',[id])
    }

    static patient_lab_test(id ,limit, offset){
        return db.execute(`SELECT * FROM mhk.medical_history where patient_id=${id} limit ${limit} offset ${offset}`)
    }

    static emppatientCount_lab_test(id){
        return db.execute('SELECT count(Regestration_id) as total FROM mhk.medical_history where employee_id=?',[id])
    }

    static emppatient_lab_test(id ,limit, offset){
        return db.execute(`SELECT * FROM mhk.medical_history where employee_id=${id} limit ${limit} offset ${offset}`)
    }

    static blood_groups(id){
        return db.execute('SELECT * FROM mhk.blood_groups')
    }

    static patinet_insurance(phone_num){
        return db.execute('SELECT * FROM mhk.patient_insurance_deteils where phonNumber = ?;',[phone_num])
    }

    static fatch_insurances(id){
        return db.execute('SELECT * FROM mhk.patient_insurance_deteils where id = ?;',[id])
    }
    
    static patinet_insurance_Byemail(email){
        return db.execute('SELECT * FROM mhk.patient_insurance_deteils where email = ?;',[email])
    }

    static patinet_Byemail(email){
        return db.execute('SELECT * FROM mhk.patient_detiels where email = ?;',[email])
    }
}
