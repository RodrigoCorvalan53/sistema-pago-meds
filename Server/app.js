const express = require('express');
const app = express();
const authRoutes = require('./API/Routes/auth.routes');

app.use(express.json());
app.use('/auth', authRoutes);

module.exports = app;