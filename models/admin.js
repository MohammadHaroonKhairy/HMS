const db = require('../util/database')


module.exports = class admin {
    constructor(){

    }

    static money_report(){
        return db.execute('	SELECT * FROM mhk.last_month_report;')
    }


    static adding_spicilization(name){
        return db.execute('call mhk.employee_sepicilization(?);',[name])
    }
    static spicilization(){
        return db.execute('	SELECT * FROM mhk.employee_speclization;')
    }

    static delete_spicilization(id){
        return db.execute('call mhk.delete_speclization(?);',[id])
    }


    
}