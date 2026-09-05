const express = require('express');
const router = express.Router();
const { verifyBVN, createBVN } = require('../utilities/BVN');
const { verifyNIN, createNIN } = require('../utilities/NIN');

router.post('/createBVN', createBVN);
router.get('/verifyBVN', verifyBVN);

router.get('/verifyNIN', verifyNIN);
router.post('/createNIN', createNIN);

module.exports = router;