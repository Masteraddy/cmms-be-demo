const express = require('express');
const auth = require('../config/auth');
const router = express.Router();
const Ppm = require('../service/ppm.service');

router.get('/', Ppm.get);

router.get('/:id', Ppm.getOne);

router.post('/', auth, Ppm.create);

router.delete('/:id', auth, Ppm.delete);

module.exports = router;
