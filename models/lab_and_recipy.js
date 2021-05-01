const db = require('../util/database')

module.exports =  class lab_and_recipy {

    static lab_tests(){
        return db.execute('SELECT * FROM mhk.lab_tests;')
    }

    static recipy_items(){
        return db.execute("SELECT * FROM mhk.medicines; ")
    }

    static addto_lab(
        regester_id,l1,i1,v1,l2,i2,v2,l3,i3,v3,l4,i4,v4,l5,i5,v5,l6,i6,v6,l7,i7,v7,l8,i8,v8

        ) {        
        return db.execute('call mhk.lab_test_info(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
        [
            regester_id,l1,i1,v1,l2,i2,v2,l3,i3,v3,l4,i4,v4,l5,i5,v5,l6,i6,v6,l7,i7,v7,l8,i8,v8
        ])
    }

    static addto_recipy(
        regester_id,r1,q1,u1,r2,q2,u2,r3,q3,u3,r4,q4,u4,r5,q5,u5,r6,q6,u6,r7,q7,u7,r8,q8,u8

        ) {        
        return db.execute('call mhk.recipy_info(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
        [
        regester_id,r1,q1,u1,r2,q2,u2,r3,q3,u3,r4,q4,u4,r5,q5,u5,r6,q6,u6,r7,q7,u7,r8,q8,u8
        ])
    }

}