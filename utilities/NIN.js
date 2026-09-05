const axios = require('axios');

const { getAuthToken } = require('../AdaptToExternalAPI/ConnectToNibssByPhoenixAPI');

const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    verifyNIN: async (req, res) => {
        const { nin } = req.body;
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
                res.status(200).json(response.data);
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // create a new NIN record
    createNIN: async (req, res) => {
        const { nin, firstName, lastName, dateOfBirth, phoneNo } = req.body;

        const token = await getAuthToken();

        try {
            const response = await axios.post(
                `${process.env.NIBSS_BASE_URL}/api/insertNin`,
                {
                    nin: nin,
                    firstName: firstName,
                    lastName: lastName,
                    dob: dateOfBirth,
                    phone: phoneNo,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                },
            );

            if (response && response.data) {
                res.status(200).json(response.data);
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}