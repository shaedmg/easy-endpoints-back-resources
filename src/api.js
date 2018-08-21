const express = require('express');
const resources = require('./resources');
const cors = require('cors');
const app = module.exports = express();
app.use(cors())
app.use(resources.path, resources.current);