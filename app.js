const express = require('express');
const app = express();

app.use(express.json());

const accountRoutes = require('./Routes/AccountRoutes');
const transactionRoutes = require('./Routes/TransactionRoutes');
const userRoutes = require('./Routes/UserRoutes');
const utilitiesRoutes = require('./Routes/UtilitiesRoutes');


app.use('/accounts', accountRoutes);
app.use('/transactions', transactionRoutes);
app.use('/users', userRoutes);
app.use('/utilities', utilitiesRoutes);

module.exports = app;
