const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const cors = require('cors')

const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')

const myEnv = dotenv.config()
dotenvExpand(myEnv)

const dependantData = require('./routes/dependant');
const userRoutes = require('./routes/user');
const { handleErrorResponse } = require('./utils/response-helper');

app.use(bodyParser.json()); // application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

app.use('/api',dependantData);
app.use('/api',userRoutes);

app.use((error, req, res, next) => {
    handleErrorResponse(res, error);
})

mongoose.connect(process.env.DB_URL,{
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex : true
    })
    .then(() => {
        app.listen(process.env.PORT || 8000);
    }).catch(err => console.log(err));