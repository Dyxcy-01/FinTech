const expres = require('express');
const router = expres.Router();
const { checkRecipientName, transfer, internalTransfer, checkTransactionStatus } = require('../Controllers/TransactionsController');

// initiate transfer
router.post('/interBankTransfer', transfer);

// check recipient name
router.get('/checkRecipientName/:accountNo', checkRecipientName);

// check transaction status
router.get('/checkTransactionStatus/:transactionId', checkTransactionStatus);

// internal bank transfer
// router.post('/transfer/internal', internalTransfer);

module.exports = router;