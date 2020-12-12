// ./app.js

const dotenv = require('dotenv');
const path = require('path');
const PORT = 80;
dotenv.config({ path: path.join(process.cwd(), 'config', '.env.development') });

const db = require('./lib/db');

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

const app = express();
app.disable('view cache');
// router
const router = require('./router');

//bodyParser
app.use(bodyParser.json())
app.use(express.urlencoded( {extended : false } ));
app.use(cookieParser());
// method-override
app.use(methodOverride('_method'));
// 뷰엔진 설정
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use('/', (req,res,next)=>{
    console.log("HTTP "+req.method+" "+req.path);
    next();
});
app.use('/', router);
app.use('/images', express.static('images'));

app.listen(PORT, () => console.log("app listening at http://localhost:",PORT));