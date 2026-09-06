const expres = require('express');
const router = expres.Router();
const { checkRecipientName, transfer, internalTransfer, checkTransactionStatus } = require('../Controllers/TransactionsController');
const authenticate = require('../Middleswares/Authentication');

// initiate transfer
router.post('/interBankTransfer', authenticate, transfer);

// check recipient name
router.get('/checkRecipientName/:accountNo', checkRecipientName);

// check transaction status
router.get('/checkTransactionStatus/:transactionId', checkTransactionStatus);

// internal bank transfer
// router.post('/transfer/internal', internalTransfer);

module.exports = router;