const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
    {
        transactionId: {
            type: String,
            required: true,
            unique: true
        },
        sender: {
            type: Number,
            required: true
        },
        receiver: {
            type: Number,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model('Transaction', transactionSchema);
// { "message": "Transfer successful", "transactionId": "TX1776340463722", "amount": 80000, "from": "1084071287", "to": "1087207670", "status": "SUCCESS" }