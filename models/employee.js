const db = require('../util/database')

module.exports =  class Employee {
    constructor(   
        full_name,
        imageUrl,
        province,
        district,
        home_no ,
        tazkira_number,
        birth_date,
        gender,
        departement,
        employee_role,
        employee_job_type,
        employee_fees ,
        employee_salary,
        employee_email ,
        employee_password,
        employee_phone,
         added_by
         )
        
        {
         this.full_name = full_name
         this.imageUrl  = imageUrl
         this.province  = province  
         this.district  = district  
         this.home_no   =home_no  
         this.tazkira_number =tazkira_number 
         this.birth_date =birth_date
         this.gender =gender 
         this.departement = departement
         this.employee_role =employee_role
         this.employee_job_type =employee_job_type
         this.employee_fees =employee_fees ;
         this.employee_salary = employee_salary;
         this.employee_email = employee_email ;
         this.employee_password= employee_password ;
         this.employee_phone  = employee_phone;
         this.added_by = added_by;  // insert current user id 
    }
    save(){
        return db.execute('call mhk.employee_regestration(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)' ,
        [
        this.full_name,
        this.tazkira_number,
        this.imageUrl,
        this.gender,
        this.birth_date,
        this.departement,
        this.employee_role,
        this.employee_job_type,
        this.employee_fees ,
        this.employee_salary,
        this.employee_phone,
        this.employee_email ,
        this.province,  
        this.district, 
        this.home_no ,
        this.added_by,
        this.employee_password
        ]
        )
    }

    static update
    (
        employee_id ,
        full_name,
         tazkira_number ,
         gender_id ,
        birth_date,
         departement_id ,
         employee_role_id ,
         job_type_id ,
         doctor_cost ,
         salary ,
        phone_number ,
        email ,
        province,  
        district, 
         home_no 
    ){
        return db.execute('call mhk.employee_updateion( ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [
            employee_id ,
            full_name,
             tazkira_number ,
             gender_id ,
            birth_date,
             departement_id ,
             employee_role_id ,
             job_type_id ,
             doctor_cost ,
             salary ,
             phone_number ,
            email ,
            province,  
            district, 
             home_no  
        ])
    }

    

    static  change_photo(emp_id, imageUrl){
        return db.execute('call mhk.change_emp_image(?,?);',[emp_id,imageUrl])
    }

    static  employee_roles(){
        return db.execute('SELECT * FROM mhk.roles')
    }

    static  employee_departement(){
        return db.execute('SELECT * FROM mhk.departements')
    }

    static  employee_specilizations (){
        return db.execute('SELECT * FROM mhk.employee_specilizations')
    }


    static findAll(){
        return db.execute('SELECT * FROM mhk.employee_detiels;')
    }
    static findById(id) {
        return db.execute('SELECT * FROM mhk.employee_detiels where employee_id = ?',[id])
    }

    static findByEmail(email) {
        return db.execute('SELECT * FROM mhk.employee_detiels where email = ?',[email])
    }

    static add_patient(
        patient_id  ,
    employee_id  ,
    old_insurance_id ,
insurance_name ,
insurance_image ,
insurance_tin  ,
birth_date,
insurance_phone_number  ,
insurance_email     ,
insur_province      ,
insur_district      ,
insure_home_no       ,
room_id  ,
bed_no       ,
roomdays     ,
patient_sicknesses 
    ){
        return db.execute('select mhk.patient_regestrationBy_doctor( ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) as id;',
        [
            patient_id  ,
employee_id  ,
old_insurance_id ,
insurance_name ,
insurance_image ,
insurance_tin  ,
birth_date,
insurance_phone_number  ,
insurance_email     ,
insur_province      ,
insur_district      ,
insure_home_no       , 
room_id  ,
bed_no       ,
roomdays     ,
patient_sicknesses 
        ]
        )
    }

    static count_emp_by_departement(emp_departement){
        return db.execute('SELECT count(employee_id) as count FROM mhk.employee_detiels where departement = ?;',[emp_departement])
    }

    static count_emp_by_role(emp_role){
        return db.execute('SELECT count(employee_id) as count FROM mhk.employee_detiels where role_type = ?;',[emp_role])
    }

}
