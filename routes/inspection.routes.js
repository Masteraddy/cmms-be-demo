const express = require('express');
const auth = require('../config/auth');
const router = express.Router();
const Inspection = require('../service/inspection.service');

router.post('/', auth, Inspection.create);

router.get('/', Inspection.get);

router.get('/:id', Inspection.getOne);

router.put('/:id', auth, Inspection.putSchedule);

router.patch('/:id', auth, Inspection.patch);

router.delete('/:id', auth, Inspection.delete);

module.exports = router;
