const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        firtName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase:true,
            trim: true
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength:8
        },
        transactionPin: {
            type:String,
            required: true
        },
        dateOfBirth: {
            type: Date
        },
        verificationStatus: {
            type: String,
            enum: ["unverified", "pending", "verified", "rejected"],
            default: "unverified"
        },
        accountStatus: {
            type: String,
            enum: ["active", "suspended", "blocked"],
            default: "active"
        }
    },
    {
        timestamps: true
    }
);

// export schema
module.exports = mongoose.model("User", userSchema);