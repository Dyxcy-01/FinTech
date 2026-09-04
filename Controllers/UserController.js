const axios = require("axios");
const {getAuthToken} = require("../AdaptToExternalAPI/ConnectToNibssByPhoenixAPI");
const { User } = require("../Models/User");
const { Account } = require("../Models/Account");
const { createAccount } = require('../Controllers/AccountController');
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  // Collect registration details from the client alongside KYC data
    createUser: async (req, res) => {
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
        } = req.body;

        try {
            // Create account through NIBSS
            const response = await createAccount(kycType, kycId, dateOfBirth);

            // 4. Axios payloads always reside inside the .data object
            if (response && response.data) {//Check  if response and expected data is returned
                const nibssData = response.data;

                // collect needed account details from NIBSS response
                const accountNumber = nibssData.accountNumber;
                const accountName = `${nibssData.accountName}`;
                const balance = nibssData.balance; // Initial balance is 15000 from NibssByPhoenix

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

                // save to database
                await user.save();

                // create account
                const account = new Account({ accountNumber, accountName, kycType, kycID, balance });

                // save to database
                await account.save();


                // create a response object to send back to the client
                res.status(201).json({
                    success: true,
                    message: nibssData.message,
                    accountNumber: nibssData.account.accountNumber,
                });
            }
        } catch (error) {
            console.error("Account Creation failed:",error.response?.data || error.message,);
            res.status(500).json({
                success: false,
                error:
                error.response?.data?.message ||
                "Error communicating with NIBSS identity layer",
            });
        }
    },
};
