const axios = require('axios');

const { getAuthToken } = require('../AdaptToExternalAPI/ConnectToNibssByPhoenixAPI');
const Transaction = require('../Models/Transaction');

const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    checkRecipientName: async (accountNumber) => {
        const token = await getAuthToken();

        try {
            const response = await axios.get(
                `${process.env.NIBSS_BASE_URL}/api/account/name-enquiry/${accountNumber}`,
                {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                },
            );

            if (response && response.data) {
                return response.data;
            }
        } catch (error) {
            return { error: error };
        }
    },
    // initiate transfer
    transfer: async (senderAccountNo, recipientAccountNo, amount) => {
        const token = await getAuthToken();

        try {
            // check recipient name
            const accountName = await this.checkRecipientName(recipientAccountNo);

            const response = await axios.post(
                `${process.env.NIBSS_BASE_URL}/api/transfer`,
                {
                from: senderAccountNo,
                to: recipientAccountNo,
                amount: amount,
                },
                {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                },
            );

            transactionId = response.data.transactionId;
            sender = senderAccountNo;
            receiver = recipientAccountNo;
            amount = amount;
            status = response.data.status;

            // save transaction to database
            const transaction = new Transaction({ transactionId, sender, receiver, amount, status });
            await transaction.save();

            // return response
            // if (response && response.data) {
            return response.data;
            // }
        } catch (error) {
            return error;
        }
    },

    // internal bank transfer
    internalTransfer: async (senderAccountNo, recipientAccountNo, amount) => {
        const token = await getAuthToken();

        AccountName = await this.checkRecipientName(recipientAccountNo);

        try {
            // fetch sender account details
            const sender = Account.findOne({ accountNumber: senderAccountNo });
            senderBalance = sender.balance;

            // check if sender has sufficient balance
            if (senderBalance < amount) {
                return { error: "Insufficient balance" };
            } else {
                sender.balance -= amount;
                await sender.save();

                // fetch recipient account details
                const receiver = Account.findOne({ accountNumber: recipientAccountNo });
                receiver.balance += amount;
                await receiver.save();
            }
        } catch (error) {
            return { error: error };
        }
    },

    // query transaction status(interbank transfer)
    checkTransactionStatus: async (transactionId) => {
        const token = await getAuthToken();

        try {
            const response = await axios.get(
                `${process.env.NIBSS_BASE_URL}/api/transaction/${transactionId}`,
                {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                },
            );

            // return response
            return response.data;
        } catch (error) {
            return error;
        }
    },

    // query transaction status(interbank transfer)
    checkTransactionStatus: async (transactionId) => {
        const token = await getAuthToken();

        try {
            const response = await axios.get(
                `${process.env.NIBSS_BASE_URL}/api/transaction/${transactionId}`,
                {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                },
            );

            // return response
            return response.data;
        } catch (error) {
            return error;
        }
    },
};

// {     "accountNumber": "1084071287",     "accountName": "John Doe",     "bankName": "Phc bank" } 