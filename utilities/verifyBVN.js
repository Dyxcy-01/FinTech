const axios = require('axios');

const { getToken } = require('../AdaptToExternalAPI/ConnectToNibssByPhoenixAPI');

const dotenv = require('dotenv');
dotenv.config();

module.exports.verifyBVN = async (bvn) => {
    const token = await getAuthToken();

    try {
        const response = await axios.post(
            `${process.env.NIBSS_BASE_URL}/api/validateBvn`,
            {
                bvn: bvn,
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