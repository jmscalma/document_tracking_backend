const env = require('../config/db.config');
const sql = require('mysql');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const pool = sql.createPool({
    host: env.host,
    user: env.user,
    password: env.password,
    database: env.db
  });

const handler = (event, callback) => {
    debug ? console.log("Register Handler"): "";

    const user_name = event.body.user_name;
    const user_email = event.body.user_email;
    const password = event.body.password;
    const user_role = event.body.user_role;
        
        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if(err) return callback.send("Bcrypt Error: " + err);

        const query = `CALL add_new_user('${user_name}', '${user_email}', '${hashedPassword}','${user_role}');`; 
        pool.getConnection((err, connection) => {
            if(err){
                console.log(err);
                callback.status(400).send({message: 'Connection error occured.'});
                return
            }
            connection.query(query, (error, results) => {
                connection.release();
                if(error){
                    console.log(error);
                    if(error.code == 'ER_DUP_ENTRY'){
                        callback.status(200).send({message: 'User already exist.'})
                    }else{
                        callback.status(400).send({message: 'Something went wrong'});
                    }
                    return
                }
                else if(results == '') {
                    callback.status(200).send({message : 'Record is empty or undefined.'});
                }
                else if(results.affectedRows == 0) {
                    callback.status(200).send({message: 'User already exist.'})
                }
                else {
                    console.log(results)
                    callback.status(200).send({message: 'Successfully registered.'})
                }
            });

        });
    })

}

module.exports = handler;