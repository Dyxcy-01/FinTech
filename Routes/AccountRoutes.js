const express = require('express');
const router = express.Router();
const { getAccounts, getBalance } = require('../Controllers/AccountController');


// Admin access
router.get('/accounts', getAccounts);

// get user balance
router.get('/account/balance/:accountNo', getBalance);