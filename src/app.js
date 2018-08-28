const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const checkLogged = require('./auth/authorization')
const api = require('./api')
const morgan = require('morgan')


const PORT = 5000;
const DB_URL = 'mongodb://mongodb:27017/ee-resources'

mongoose.connect(DB_URL)
const app = express();

app.use(morgan())
app.use(bodyParser.json())
app.use(cors())
app.use('/api', checkLogged, api)

module.exports = () => {
    return app.listen(PORT, () => console.log(`
      Easyendpoints backend
      
      Server has been started
      Running at http://localhost:${PORT}`
      ))
}