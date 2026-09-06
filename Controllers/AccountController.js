const dotenv = require('dotenv');
dotenv.config();

const axios = require('axios');
const User = require('../Models/User');

const { getAuthToken } = require('../AdaptToExternalAPI/ConnectToNibssByPhoenixAPI');

module.exports = {
    createAccount: async (kycType, kycId, dateOfBirth) => {
        try {
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

            return response.data;

        } catch (error) {
            if (error.response) {
                console.log("NIBSS API error:", error.response.status, error.response.data);
                return { error: error.response.data, status: error.response.status};
            }
            
            console.log("Unexpected error in createAccount:", error.message);
            return { error: { message: error.message }, status: 500 };
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
        const userId = req.user.userId; // User ID from the authenticated request
        
        // confirm if login user is the same as the sender account number
        const user = await User.findById(userId);

        if(user.accountNumber != userAccountNo) {
            return res.status(403).json({ error: "You don't have access to this account" });
        }

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
            if (error.response) {
                console.log('Error from NIBSS: ', error.status, error.response.data);
                return { error: error.response.data, status: error.response.status};
            }

            console.log('Unexpected error: ', error.message);
            return { error: { message: error.message }, status: 500 };
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

