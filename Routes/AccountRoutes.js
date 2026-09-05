const express = require('express');
const router = express.Router();
const { getAccounts, getBalance, verifyReceipientName, createAccount } = require('../Controllers/AccountController');

    // CREATE
// Create account
router.post('/createAccount', createAccount);

    // READ
// Admin access
router.get('/getAllAccounts', getAccounts);

// get user balance
router.get('/getBalance/:accountNo', getBalance);

// verify account name
router.get('/verifyAccountName/:accountNo', verifyReceipientName);


module.exports = router;
