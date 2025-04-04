require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

const roomsRoute = require('./routes/v1/rooms');
app.use('/module-b/api/v1/rooms', roomsRoute);

app.listen(process.env.API_PORT, () => {
    console.log(`Backend server started on http://localhost:${process.env.API_PORT}`);
});