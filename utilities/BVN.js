const axios = require('axios');

const { getAuthToken } = require('../AdaptToExternalAPI/ConnectToNibssByPhoenixAPI');

const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    verifyBVN: async (req, res) => {
        const { bvn } = req.body;
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
                res.status(200).json(response.data);
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // create a new BVN record
    createBVN: async (req, res) => {
        const { bvn, firstName, lastName, dateOfBirth, phoneNo } = req.body;

        const token = await getAuthToken();
        // const response;
        try {
            const response = await axios.post(
                `${process.env.NIBSS_BASE_URL}/api/insertBvn`,
                {
                    bvn: bvn,
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
            if (error.response) {
                // The API responded with an error status (e.g. 409, 400, 401)
                console.log("Status:", error.response.status);
                console.log("Body:", error.response.data);

            return res.status(error.response.status).json(error.response.data);
            }

            // No response at all (network error, timeout, etc.)
            console.log("Request failed:", error.message);
            res.status(500).json({ error: "Failed to reach NibssByPhoenix API" });
        }
    }
}