const mongoose = require('mongoose');

const accountSchema = mongoose.Schema(
    {
        accountNumber: {
            type: String,
            required: true,
            unique: true
        },
        accountName: {
            type: String,
            required: true
        },
        kycType: {
            type: String,
            required: true
        },
        kycId: {
            type: Number,
            required: true
        },
        balance: {
            type: Number,
            default: 15000
        }
    },
    {
        timestamps: true
    }
);

// export the model to be used in other parts of the application
module.exports = mongoose.model('Account', accountSchema);



// Use this to decide how my account collection may look like if I decide to have a collection in my database

// {
//     "message": "Account created successfully",
//     "account": {
//         "accountNumber": "7583958634",
//         "accountName": "Onyekachi KA",
//         "bankCode": "758",
//         "fintechId": "6a99395eb359e9498a9049b3",
//         "kycType": "bvn",
//         "kycID": "10840712823",
//         "balance": 15000,
//         "_id": "6a993eecb359e9498a9049b5",
//         "createdAt": "2026-09-03T09:33:32.253Z",
//         "updatedAt": "2026-09-03T09:33:32.253Z"
//     }
// }
