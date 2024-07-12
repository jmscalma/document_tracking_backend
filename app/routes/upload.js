// routes/uploadRoutes.js

const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadDocumentController');

// Route for handling file upload
router.post('/upload', uploadController.uploadFile, uploadController.handler);

module.exports = router;
