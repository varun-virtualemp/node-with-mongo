const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const cors = require('cors')

const {dbUrl, port} = require('./utils/constants');

const dependantData = require('./routes/dependant');
const userRoutes = require('./routes/user');
const { handleErrorResponse } = require('./utils/response-helper');

app.use(bodyParser.json()); // application/json

app.use(cors())

app.use('/api',dependantData);
app.use('/api',userRoutes);

app.use((error, req, res, next) => {
    handleErrorResponse(res, error);
})

mongoose.connect(dbUrl,{
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex : true
    })
    .then(() => {
        app.listen(port);
    }).catch(err => console.log(err));