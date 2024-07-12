const express = require('express')
const router = express.Router();

// Validation Script
const validator = require('../middleware/validator');

//Functions
const register = require('../controllers/register');

// Models
const registerSchema = require('../models/auth/register');


router.route('/register')
.post(validator.validate({body: registerSchema}), (req, res) => {
    register(req, res);
});


module.exports = router;