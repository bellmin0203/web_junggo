const db = require('../../lib/db');
const crypto = require('../../lib/crypto');
const jwt = require('../../lib/jwt');

module.exports.goodsWriteMiddleware = function(req, res, next){
    let category = db.query("SELECT id,strName FROM CATEGORY");
    res.locals.category = category;
    
    city = db.query("SELECT id,strName FROM CITY_TYPE");
    res.locals.city = city;
    next();
}


module.exports.goodsWriteInsertMiddleware = function(req, res, next){
    const decoded = jwt.checkToken(req.cookies.token, "access_token");
    const { price, category, city, title, content } = req.body;
    console.log(req.file);
    const photo = req.file.filename;
    const params = [decoded['no'], title, content, price, photo, category, city];
    const result = db.query("INSERT INTO BOARD (writer, title, content, price, photo, status, category, city) VALUES (?, ?, ?, ?, ?, 1, ?, ?)",params);
    return res.redirect(301,'/')
}


module.exports.goodsListMiddleware = function(req, res, next){
    const goods = db.query("\
    SELECT b.`no`, u.nickname `writer`, title, content, price, bs.strName `status`, c.strName `category`, ct.strName `city`, photo FROM BOARD b\
	LEFT JOIN `USER`u ON u.`no` = b.writer\
	LEFT JOIN BOARD_STATUS bs ON b.status = bs.id\
	LEFT JOIN CITY_TYPE ct ON b.city = ct.id\
	LEFT JOIN CATEGORY c ON b.category = c.id;\
    ");
    res.locals.goods = goods;
    next();
}