const db = require("../../lib/db");
const crypto = require("../../lib/crypto");
const jwt = require("../../lib/jwt");

module.exports.loginMiddleware = function (req, res, next) {
    try {
        const id = req.body.id;
        const pw = req.body.pw;
        const hash = crypto.hash(pw);

        const rows = db.query("SELECT no, id, nickname, grade, date_format(dtCreate, '%Y-%m-%d') `dtCreate` FROM USER WHERE id=? AND pw=?", [id, hash]);
        const token = jwt.createAccessToken(rows[0].no, rows[0].id, rows[0].nickname, rows[0].grade, rows[0].dtCreate);

        res.append("Set-Cookie", "token=" + token + "; Path=/;");
        res.locals.token = token;
        console.log("Login Success ID => " + id);
        next();
    } catch (err) {
        next(err);
    }
};

module.exports.signupMiddleware = function (req, res, next) {
    try {
        const id = req.body.id;
        const pw = req.body.pw;
        const hash = crypto.hash(pw);
        const nickname = req.body.nickname;

        const result = db.query("INSERT INTO USER (id, pw, nickname) VALUES(?, ?, ?)", [id, hash, nickname]);
        const rows = db.query("SELECT no, id, nickname, grade, date_format(dtCreate, '%Y-%m-%d') `dtCreate` FROM USER WHERE no=?", [result.insertId]);
        const token = jwt.createAccessToken(rows[0].no, rows[0].id, rows[0].nickname, rows[0].grade, rows[0].dtCreate);

        res.append("Set-Cookie", "token=" + token + "; Path=/;");
        res.locals.token = token;

        /* res.status(201).json({
            result: 'ok',
            token
        }); */
        console.log("Sign up Success ID => " + id);
        next();
    } catch (err) {
        next(err);
    }
};

module.exports.logout = function (req, res, next) {
    res.clearCookie("token");
    next();
};

module.exports.profileModify = (req, res, next) => {
    res.render("profileModify", {
        title: "회원정보 수정 - 평화나라",
        page: "profileModify",
        user: res.locals.user,
    });
    next();
};

module.exports.profileUpdate = (req, res, next) => {
    const nickname = req.body.nickname;
    db.query("UPDATE USER SET nickname = ? WHERE no = ?", [nickname, req.params.no]);

    res.clearCookie("token");

    const rows = db.query("SELECT no, id, nickname, grade, date_format(dtCreate, '%Y-%m-%d') `dtCreate` FROM USER WHERE no = ?", [req.params.no]);
    const token = jwt.createAccessToken(rows[0].no, rows[0].id, rows[0].nickname, rows[0].grade, rows[0].dtCreate);

    res.append("Set-Cookie", "token=" + token + "; Path=/;");
    res.locals.token = token;
    next();
};
