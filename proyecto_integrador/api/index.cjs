const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = require('../back/src/app.cjs');

module.exports = app;
