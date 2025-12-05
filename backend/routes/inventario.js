const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');

router.get('/:centro', inventarioController.getInventarioByCentro);

module.exports = router;
