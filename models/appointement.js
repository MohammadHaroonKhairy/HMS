const db = require('../util/database')

module.exports =  class appointement {
    constructor(id)
    {
        this.id = id
    };
    static booking(employee_id,patient_id,date,time){
        return db.execute('call mhk.booking_appointement(?,?,?,?);',[employee_id,patient_id,date,time])
    }

    static updating(appointement_id,employee_id,date,time){
        return db.execute('call mhk.`appointement updatetion`(?,?,?,?);',[appointement_id,employee_id,,date,time])
    }

    static findByStatusandId(id){
        return db.execute('SELECT * FROM mhk.appointement_history where patient_id = ? and current_status = "In Progress"  ;',[id])
    }
    
    static empfindByStatusandId(id){
        return db.execute('SELECT * FROM mhk.appointement_history where employee_id = ? and current_status = "In Progress"  ;',[id])
    }

    static fin_by_id(id) {
        return db.execute('SELECT * FROM mhk.appointement_history where id=?',[id])
    }

    static Count_All() {
        return db.execute('SELECT count(*)as total FROM mhk.appointement_history ')
    }
    
    static find_All(limit, offset) {
        return db.execute(`SELECT * FROM mhk.appointement_history   limit ${limit} offset ${offset} `)
    }

    static set_to(id,status) {
        return db.execute('call mhk.appointement_status_updatetion(?, ?);',[id,status])
    }
    static findCountById(id) {
        return db.execute('SELECT count(id) as total FROM mhk.appointement_history where patient_id=?',[id])
    }

    static findById(id, limit, offset) {
        return db.execute(`SELECT * FROM mhk.appointement_history where patient_id=${id} limit ${limit} offset ${offset}`)
    }
    static empfindCountById(id) {
        return db.execute('SELECT count(id) as total FROM mhk.appointement_history where employee_id=?',[id])
    }

    static empfindById(id, limit, offset) {
        return db.execute(`SELECT * FROM mhk.appointement_history where employee_id=${id} limit ${limit} offset ${offset}`)
    }

    static room(id) {
        return db.execute('SELECT * FROM mhk.rooms')
    }

    static Countappointement_B_D_history(first_date, last_date){
        return db.execute(`SELECT count(*) as total
        FROM mhk.appointement_history
        WHERE appointement_date between ${first_date} AND ${last_date};`)
    }

    static appointement_B_D_history(first_date, last_date ,limit , offset){
        console.log(limit, offset,"")
        return db.execute('call mhk.betweem_days_report(?,?,?,?)',[
            limit, offset,first_date,last_date
        ])
    }
}