const express = require('express');
const app = express();
const authRoutes = require('./API/Routes/auth.routes');
const userRoutes = require('./API/Routes/user.routes');

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

module.exports = app;