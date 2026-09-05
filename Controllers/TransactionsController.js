const axios = require('axios');

const { getAuthToken } = require('../AdaptToExternalAPI/ConnectToNibssByPhoenixAPI');
const Transaction = require('../Models/Transaction');
const Account = require('../Models/Account');

const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    checkRecipientName: async (req, res) => {
        const token = await getAuthToken();
        const {accountNo} = req.params;
        console.log(`Passed account number na: ${accountNo}`);

        try {
            const response = await axios.get(
                `${process.env.NIBSS_BASE_URL}/api/account/name-enquiry/${accountNo}`,
                {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                },
            );

            if (response && response.data) {
                res.status(200).json(response.data);
            }
        } catch (error) {
                if (error.response) {
                    console.log( "NIBSS API error:", error.response.status, error.response.data );
                    return res.status(error.response.status).json(error.response.data);
            }
            
                console.log("Unexpected error:", error.message);
                res.status(500).json({ error: error.message });
        }
    },
    // initiate transfer
    transfer: async (req, res) => {
        const token = await getAuthToken();
        const { senderAccountNo, recipientAccountNo, amount } = req.body;

        try {
            // check recipient name (I modify the related method below, to attend to api route request directly)
            // const accountName = await this.checkRecipientName(recipientAccountNo);
            // console.log('Recipient account name:', accountName);

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
            console.log(response.data)

            const transactionId = response.data.reference;
            const sender = senderAccountNo;
            const receiver = recipientAccountNo;
            const status = response.data.status;
            // amount already exist above

            // save transaction to database
            const transaction = new Transaction({ transactionId, sender, receiver, amount, status });
            await transaction.save();

            // return response
            // if (response && response.data) {
            res.status(200).json(response.data);
            // }
        } catch (error) {
            if (error.response) {
                console.log( "NIBSS API error:", error.response.status, error.response.data );
                return res.status(error.response.status).json(error.response.data);
            }
            
            console.log("Unexpected error:", error.message);
            res.status(500).json({ error: error.message });
        }
    },

    // internal bank transfer
    internalTransfer: async (req, res) => {
        const token = await getAuthToken();
        const { senderAccountNo, recipientAccountNo, amount } = req.body;

        AccountName = await this.checkRecipientName(recipientAccountNo);

        try {
            // fetch sender account details
            const sender = Account.findOne({ accountNumber: senderAccountNo });
            senderBalance = sender.balance;

            // check if sender has sufficient balance
            if (senderBalance < amount) {
                res.status(400).json({ error: "Insufficient balance" });
            } else {
                sender.balance -= amount;
                await sender.save();

                // fetch recipient account details
                const receiver = Account.findOne({ accountNumber: recipientAccountNo });
                receiver.balance += amount;
                await receiver.save();

                res.status(200).json({ message: "Transfer successful", transactionId: `TX${Date.now()}`, amount, from: senderAccountNo, to: recipientAccountNo, status: "SUCCESS" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // query transaction status(interbank transfer)
    checkTransactionStatus: async (req, res) => {
        const token = await getAuthToken();
        const { transactionId } = req.params;

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
            res.status(200).json(response.data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // query transaction status(interbank transfer)
    // checkTransactionStatus: async (transactionId) => {
    //     const token = await getAuthToken();

    //     try {
    //         const response = await axios.get(
    //             `${process.env.NIBSS_BASE_URL}/api/transaction/${transactionId}`,
    //             {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //                 "Content-Type": "application/json"
    //             },
    //             },
    //         );

    //         // return response
    //         return response.data;
    //     } catch (error) {
    //         return error;
    //     }
    // },
};

// {     "accountNumber": "1084071287",     "accountName": "John Doe",     "bankName": "Phc bank" } 