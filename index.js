const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(process.cwd(), 'config', '.env.development') });

const db = require('./lib/db');

const app = express();
const router = express.Router();

app.use('', router);

app.listen(54300, ()=>console.log("app listening at http://localhost:54300"));
