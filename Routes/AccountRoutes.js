const express = require('express');
const router = express.Router();
const { getAccounts, getBalance, verifyReceipientName, createAccount } = require('../Controllers/AccountController');

// CREATE
// Create account
router.post('/createAccount', createAccount);

// READ
// Admin access
router.get('/accounts', getAccounts);

// get user balance
router.get('/account/balance/:accountNo', getBalance);

// verify account name
router.get('/account/verifyAcountName/:accountNo', verifyReceipientName);