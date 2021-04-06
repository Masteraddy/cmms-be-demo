const express = require('express');
const auth = require('../config/auth');
const router = express.Router();

const Request = require('../service/request.service');

router.get('/', auth, Request.find);

router.get('/:id', auth, Request.findOne);

router.post('/', auth, Request.post);

router.post('/:id', auth, Request.postComment);

router.put('/:id', auth, Request.putSchedule);

router.patch('/:id', auth, Request.patch);

router.delete('/:id', auth, Request.delete);

module.exports = router;
