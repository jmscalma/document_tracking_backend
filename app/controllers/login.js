const env = require('../config/db.config')
const sql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const debug = require('../config/debug')
console.log(debug);

const pool = sql.createPool({
    host: env.hostname,
    user: env.user,
    password: env.password,
    database: env.db
});

const json_f  = {result: 'Failed', message: 'Something went wrong.'}

const handler = async (event,callback) => {
    debug ? console.log("Login Handler") : ''

    const user = event.body
    const query = `call user_login('${user.username}');`;
    
    pool.getConnection((err,connection) => {
        if(err) {
            debug ? console.log(err): '';
            callback.send(null,{message: 'Connection error occured.'});
            return
        }
        connection.release()
        connection.query(query, (error,results,fields) => {
            if(error) {
                debug ? console.log(err): '';
                callback.status(400).send(json_f);
            }
            else if(results == '' || results[0].length < 1) {
                callback.status(200).send(json_f);
            }
            else {
                let hashedPassword = results[0][0].password;
                console.log(results);
                bcrypt.compare(user.password, hashedPassword, (err, result) => {
                    if(err) return callback.status(200).send({message : 'Something went wrong.'});
                    if(result == true){
                        connection.query((err, res) => {
                            if(err){
                                debug ? console.log(err): '';
                                return
                            }
                            else if (res = ''){
                                return callback.status(202).send({message: 'Error 202'})
                            }
                            else {
                                console.log(err)
                                return
                            }
                        });
                        let token = generateAccessToken({username: user.username});
                        return callback.json({
                            message: 'Successfully logged in.',
                            token: token,
                            username: user.username
                        });
                    }
                    callback.send({message : 'Invalid Credentials'});
                })
            }
        });
        
    });

}


const generateAccessToken = (user) => {
    return jwt.sign(user, 'mysecret', {expiresIn:10800});
}

module.exports = handler;