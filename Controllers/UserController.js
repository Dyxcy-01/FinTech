const axios = require("axios");
const {getAuthToken} = require("../AdaptToExternalAPI/ConnectToNibssByPhoenixAPI");
const { User } = require("../Models/User");
const { createAccount } = require('../Controllers/AccountController');
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  // Collect registration details from the client alongside KYC data
    createUser: async (registrationData) => {
        const {
            kycType,
            kycId,
            dateOfBirth,
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            transactionPin,
        } = registrationData;

        try {
            // Create account through NIBSS
            const response = await createAccount(kycType, kycId, dateOfBirth);

            // 4. Axios payloads always reside inside the .data object
            if (response && response.data) {//Check  if response and expected data is returned
                const nibssData = response.data;

                // Hash passwords before storing them in your database for security
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                const hashedTxPin = await bcrypt.hash(
                    transactionPin,
                    salt,
                );

                // Create the user instance combining local data + NIBSS assigned account details
                const user = new User({
                    firstName: firstName, // From registration form Nibss
                    lastName: lastName, // From registration form nibss
                    email: email, // From registration form
                    phoneNumber: phoneNumber, // From registration form
                    password: hashedPassword, // Secured hash from reg form
                    transactionPassword: hashedTxPassword, // Secured hash
                    dateOfBirth: dateOfBirth, // From registration form
                    verificationStatus: "verified", // Manually set status flag
                    accountStatus: "active", // Explicit fallback assignment
                    kycType: kycType,
                    accountNumber: nibssData.accountNumber, // 5. Retrieved dynamically from NIBSS
                    bankName: nibssData.bankName, // Retrieved dynamically from NIBSS
                });

                // Added await to prevent background operational race bugs
                await user.save();

                return {
                    success: true,
                    message: nibssData.message,
                    accountNumber: nibssData.account.accountNumber,
                };
            }
        } catch (error) {
            console.error("Account Creation failed:",error.response?.data || error.message,);
            return {
                success: false,
                error:
                error.response?.data?.message ||
                "Error communicating with NIBSS identity layer",
            };
        }
    },
};
