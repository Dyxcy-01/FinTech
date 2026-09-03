const axios = require('axios');

const { getToken, getAuthToken } = require('../AdaptToExternalAPI/ConnectToNibssByPhoenixAPI');

const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    checkRecipientName: async (accountNumber) => {
        const token = await getAuthToken();

        try {
            const response = await axios.post(
                `${process.env.NIBSS_BASE_URL}/api/account/name-enquiry/${accountNumber}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response && response.data) {
                return response.data;
            }
        } catch (error) {
            return { error: error };
        }
    },

    transfer: async (senderAccountNo, recipientAccountNo, amount) => {
        const token = await getAuthToken();

        try {
            const response = await axios.post(
                `${process.env.NIBSS_BASE_URL}/api/transfer`,
                {
                    from: senderAccountNo,
                    to: recipientAccountNo,
                    amount: amount,
                },
                {
                    header: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                },
            );

            // return response
            // if (response && response.data) {
                return response.data;
            // }

        } catch (error) {
            return error;
        }
    }
}

// {     "accountNumber": "1084071287",     "accountName": "John Doe",     "bankName": "Phc bank" } 