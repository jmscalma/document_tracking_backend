const express = require('express');
const router = express.Router();
const documentController = require('../controllers/DocumentController');

router.get('/documents', documentController.getAllDocuments);

module.exports = router;