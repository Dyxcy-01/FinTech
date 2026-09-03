const axios = require('axios');

const { getToken } = require('../AdaptToExternalAPI/ConnectToNibssByPhoenixAPI');

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
    }
}

// {     "accountNumber": "1084071287",     "accountName": "John Doe",     "bankName": "Phc bank" } 