// ./app.js

const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const PORT = 80;
dotenv.config({ path: path.join(process.cwd(), 'config', '.env.development') });

const db = require('./lib/db');

const app = express();

// router
const router = express.Router();
const indexRoute = require('./router/index');

// 뷰엔진 설정
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use('/', indexRoute);

app.use('', router);

app.listen(PORT, () => console.log("app listening at http://localhost:",PORT));
