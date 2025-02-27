require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const cron = require('node-cron');

const connectToDatabase = require('./config/db');
const routes = require('./routes')

const app = express();
connectToDatabase();
const PORT = process.env.PORT;
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));
app.use('/api', routes)

cron.schedule('5 0 * * *', async () => {
    try {
        console.log(`[${new Date().toISOString()}] Updated to 'completed'.`);
    } catch (error) {
        console.error('Error :', error);
    }
});

app.listen(PORT, () => {
    console.log(`server is listening  on ${PORT}`);
});

module.exports = app;