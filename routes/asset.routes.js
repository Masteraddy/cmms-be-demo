const express = require('express');
const auth = require('../config/auth');
const router = express.Router();
const Asset = require('../service/asset.service');

router.get('/', Asset.get);

router.get('/:id', Asset.getOne);

router.post('/', auth, Asset.create);

router.patch('/:id', auth, Asset.patch);

router.put('/select/:id', auth, Asset.select);

router.put('/submit/:id/:lendId', auth, Asset.submit);

router.delete('/:id', auth, Asset.delete);

module.exports = router;
