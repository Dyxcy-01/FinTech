const axios = require("axios");
const {getAuthToken} = require("../AdaptToExternalAPI/ConnectToNibssByPhoenixAPI");
const User = require("../Models/User");
const Account = require("../Models/Account");
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
            console.log("NIBSS Account Creation Response:", response);

            if (response.error) {
                error = response.error;
                status = response.status;
            }
            // Handle NIBSS-side failure (e.g. duplicate BVN, invalid input, etc.)
            if (response.error) {
                return res.status(response.error.status || 500).json({ success: false, error: response.error.message || response.error
                });
            }

            // 4. Axios payloads always reside inside the .data object
            if (response && response.account) {//Check  if response and expected data is returned
                const accountDetails = response.account; // 5. Extract the account object from the response

                // collect needed account details from NIBSS response
                const accountNumber = accountDetails.accountNumber;
                const accountName = accountDetails.accountName;
                const balance = accountDetails.balance; // Initial balance is 15000 from NibssByPhoenix

                // Hash passwords before storing them in your database for security
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                const hashedTxPin = await bcrypt.hash( transactionPin, salt );

                // Create the user instance combining local data + NIBSS assigned account details
                const user = new User({
                    firstName: firstName, // From registration form Nibss
                    lastName: lastName, // From registration form nibss
                    email: email, // From registration form
                    accountNumber: accountNumber,
                    phoneNumber: phoneNumber, // From registration form
                    password: hashedPassword, // Secured hash from reg form
                    transactionPin: hashedTxPin, // Secured hash
                    dateOfBirth: dateOfBirth, // From registration form
                    verificationStatus: "verified", // Manually set status flag
                    accountStatus: "active", // Explicit fallback assignment
                    kycType: kycType,
                    accountNumber: accountDetails.accountNumber, // 5. Retrieved dynamically from NIBSS
                });

                // save to database
                await user.save();
                console.log("User created successfully:", user);

                // Move to createAccount method
                // create account
                const account = new Account({ accountNumber, accountName, kycType, kycId, balance });
                // save to database
                await account.save();
                console.log("Account created successfully:", account);

                // create a response object to send back to the client
                res.status(201).json({
                    success: true,
                    message: response.message,
                    accountNumber: accountDetails.accountNumber,
                });
            }
        } catch (error) {
            console.error("Account Creation failed:",error);
            res.status(500).json({
                success: false,
                error: error
            });
        }
    },

    // login user
    loginUser: async (req, res) => {
        const { email, password } = req.body;

        try {
            // Find user by email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            // Compare provided password with stored hashed password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: "Invalid credentials" });
            }

            // Generate a JWT token
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
            
            // For now, we'll just send a success response
            res.status(200).json({ success: true, message: "Login successful", token });

        } catch (error) {
            console.error("Login failed:", error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

};
