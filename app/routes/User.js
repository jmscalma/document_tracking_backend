const express = require('express')
const router = express.Router();

const authRoutes = require('./auth');

router.use('/login', authRoutes);


module.exports = router;