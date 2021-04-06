const express = require('express');
const auth = require('../config/auth');
const router = express.Router();

const RequestOut = require('../service/requestout.service');

router.get('/', auth, RequestOut.find);

router.get('/:id', auth, RequestOut.findOne);

router.post('/', RequestOut.post);

router.post('/:id', auth, RequestOut.postComment);

router.put('/:id', auth, RequestOut.putSchedule);

router.patch('/:id', auth, RequestOut.patch);

router.delete('/:id', auth, RequestOut.delete);

module.exports = router;
