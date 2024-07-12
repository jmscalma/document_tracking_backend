const env = require('../config/db.config');
const sql = require('mysql');

const pool = sql.createPool({
    host: env.hostname,
    user: env.user,
    password: env.password,
    database: env.db
});


exports.getAllDocuments = (req, res) => {

    console.log(req.params.id);    
    pool.getConnection((err,connection) => {
        if(err) {
            debug ? console.log(err): '';
            res.status(500).json({ error: 'Connection error occurred.' });
            return
        }else{
            connection.release();
            connection.query('CALL get_all_documents', (error, results) => {
                if (error) {
                  console.error('Error executing stored procedure:', error);
                  res.status(500).json({ error: 'An error occurred while fetching documents' });
                } else {
                  const documents = results[0]; 
                  res.json(documents); 
                }
              });
        }
    })
  };






  