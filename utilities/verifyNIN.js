const axios = require('axios');

const { getToken } = require('../AdaptToExternalAPI/ConnectToNibssByPhoenixAPI');

const dotenv = require('dotenv');
dotenv.config();

module.exports.verifyNIN = async (nin) => {
    const token = await getAuthToken();

    try {
        const response = await axios.post(
            `${process.env.NIBSS_BASE_URL}/api/validateNin`,
            {
                nin: nin,
            },
            {
                headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                },
            },
        );

        if (response && response.data) {
            return response.data;
        }
    } catch (error) {
        return { error: error };
    }
}