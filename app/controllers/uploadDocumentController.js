const multer = require('multer')
const path = require('path')
const sql = require('mysql')
const env = require('../config/db.config');


const pool = sql.createPool({
    host: env.hostname,
    user: env.user,
    password: env.password,
    database: env.db
});

const json_f  = {result: 'Failed', message: 'Something went wrong.'}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify the destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        // Generate a unique filename based on timestamp and original file extension
        const fileName = file.originalname;
        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'));
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
});

const uploadFile = upload.single('document'); 

const handler = (event,callback) => {
    debug ? console.log("Upload Document Handler"): "";

    const document_name = event.body.document_name;
    const document_description = event.body.document_description;
    const document_status = event.body.document_status;
    const created_at = event.body.created_at;
    const path = "sdad" // sample only

    const query = `call insert_document('${document_name}', '${document_description}', '${document_status}', '${created_at}', '${path}');`;
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
                callback.status(200).send({message: 'Document Uploaded successfully.'})
            }
        });  
    })


}

module.exports = { uploadFile, handler }