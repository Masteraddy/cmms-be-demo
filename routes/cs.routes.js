const express = require('express');
const auth = require('../config/auth');
const router = express.Router();
const Cs = require('../service/cs.service');

router.post('/', Cs.create);

router.get('/', Cs.get);

router.get('/:id', Cs.getOne);

router.delete('/:id', auth, Cs.delete);

module.exports = router;
