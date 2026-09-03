const { User } = require("../Models/User");

const dotenv = require('dotenv');
dotenv.config();

const { getAuthToken } = require('../AdaptToExternalAPI/ConnectToNibssByPhoenixAPI');

module.exports = {
    createAccount: async (kycType, kycId, dateOfBirth) => {
        try {
            //generate token
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

            return response;

        } catch (error) {
            return error;
        }
    },

    // verify recipient name
    verifyRecipientName: async (accountNumber) => {
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
                return response.data;
            }
        } catch (error) {
            return { error: error };
        }
    },
}

