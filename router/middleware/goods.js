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

const ONE_PAGE_CONTENT_COUNT = 10;
module.exports.goodsListMiddleware = function(req, res, next){
    const page = req.params.page===undefined?1:parseInt(req.params.page);

    const goods = db.query("\
    SELECT b.`no`, u.nickname `writer`, title, content, price, bs.strName `status`, c.strName `category`, ct.strName `city`, photo FROM BOARD b\
	LEFT JOIN `USER`u ON u.`no` = b.writer\
	LEFT JOIN BOARD_STATUS bs ON b.status = bs.id\
	LEFT JOIN CITY_TYPE ct ON b.city = ct.id\
    LEFT JOIN CATEGORY c ON b.category = c.id\
    LIMIT ?, ?;\
    ",[(page-1)*ONE_PAGE_CONTENT_COUNT,ONE_PAGE_CONTENT_COUNT]);
    const rows = db.query("SELECT count(*) 'count' FROM BOARD")
    const maxPage = Math.ceil((rows[0].count)/ONE_PAGE_CONTENT_COUNT)
    const nextPages = [];
    const prevPages = [];
    const prevLimit = (maxPage - page)>3?3:(maxPage - page);
    for(var i=page-1;i>0;i--){
        prevPages.push(i);
        if(prevPages.length>=(6-prevLimit)) break;
    }
    
    for(var i=page+1;i<=maxPage;i++){
        nextPages.push(i);
        if(nextPages.length>=6-prevPages.length) break;
    }

    const pageInfo = {
        maxPage : maxPage,
        nowPage : page,
        nextPages : nextPages,
        prevPages : prevPages.reverse(),
        onePageContent : ONE_PAGE_CONTENT_COUNT,
    }
    console.log(pageInfo);
    res.locals.goods = goods;
    res.locals.pageInfo = pageInfo;
    next();
}
/* GET '/' => 최근 중고 매물 */
module.exports.recentlyGoods = (req, res, next) => {
    const recGoods = db.query("SELECT no, title, price, photo FROM BOARD ORDER BY dtCreate DESC LIMIT 8");
    console.log(recGoods.length);
    res.locals.goods = recGoods;
    next();
}