const { User } = require("../Models/User");

const dotenv = require('dotenv');
dotenv.config();

const { getAuthToken } = require('../AdaptToExternalAPI/ConnectToNibssByPhoenixAPI');

module.exports = {
    createAccount: async (req, res) => {
        try {
            const { kycType, kycId, dateOfBirth } = req.body;
            const token = await getAuthToken();

            // Send http request to NIBSS simulator
            const response = await axios.post(
                `${process.env.NIBSS_BASE_URL}/api/account/create`,
                {
                    kycType: kycType, // 'bvn' or 'nin'
                    kycID: kycId,
                    dob: dateOfBirth, // 'YYYY-MM-DD'
                },
                {
                    headers: {
                        // 3. Fixed authorization template string syntax
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            res.status(200).json(response.data);

        } catch (error) {
            res.status(500).json({ error: error });
        }
    },

    // verify recipient name
    verifyReceipientName: async (req, res) => {
        const accountNumber = req.params.accountNo;
        const token = await getAuthToken();

        try {
            const response = await axios.get(
                `${process.env.NIBSS_BASE_URL}/api/account/name-enquiry/${accountNumber}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response && response.data) {
                res.status(200).json(response.data);
            }
        } catch (error) {
            res.status(500).json({ error: error });
        }
    },

    // get account balance
    getBalance: async (req, res) => {
        const userAccountNo = req.params.accountNo;
        const token = await getAuthToken();

        try {
            const response = await axios.get(
                `${process.env.NIBSS_BASE_URL}/api/account/balance/${userAccountNo}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            res.status(200).json(response.data);

        } catch (error) {
            res.status(500).json({ error: error });
        }
    },

    // get all accounts
    getAccounts: async (req, res) => {
        const token = await getAuthToken();

        try {
            const response = await axios.get(
                `${process.env.NIBSS_BASE_URL}/api/accounts`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            res.status(200).json(response.data);

        } catch (error) {
            res.status(500).json({error: error});
        }
    }
}

