const db = require('../../lib/db');
const crypto = require('../../lib/crypto');
const jwt = require('../../lib/jwt');

module.exports.loginMiddleware = function(req, res, next){
    const id = req.body.id;
    const pw = req.body.pw;
    console.log(id);
    const hash = crypto.hash(pw);
    const rows = db.query("SELECT no,id,nickname,grade,date_format(dtCreate, '%Y-%m-%d') `dtCreate` FROM USER WHERE id=? AND pw=?",[id,hash]);
    console.log(rows);
    const token = jwt.createAccessToken(rows[0].no,rows[0].id,rows[0].nickname,rows[0].grade,rows[0].dtCreate);
    res.append('Set-Cookie', 'token='+token+'; Path=/;');
    res.append('Set-Cookie', 'token='+token+'; Path=/;');
    res.locals.token = token;
    return res.redirect(301,'/')
    next();
}

module.exports.signupMiddleware = function(req, res, next){
    const id = req.body.id;
    const pw = req.body.pw;
    const hash = crypto.hash(pw);
    const nickname = req.body.nickname;
    const result = db.query("INSERT INTO USER (id,pw,nickname) VALUES(?,?,?)",[id,hash,nickname]);
    const rows = db.query("SELECT no,id,nickname,grade,date_format(dtCreate, '%Y-%m-%d') `dtCreate` FROM USER WHERE no=?",[result.insertId]);
    const token = jwt.createAccessToken(rows[0].no,rows[0].id,rows[0].nickname,rows[0].grade,rows[0].dtCreate);
    res.append('Set-Cookie', 'token='+token+'; Path=/;');
    res.locals.token = token;
    return res.redirect(301,'/')
    next();
}

module.exports.logout = function(req, res, next){
    res.clearCookie("token");
    next();
}
