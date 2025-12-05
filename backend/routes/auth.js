const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/usuarios', authController.listarUsuarios);
router.post('/login', authController.login);

module.exports = router;
