const db = require("../../lib/db");
const jwt = require("../../lib/jwt");

module.exports.writeMiddleware = function (req, res, next) {
    try {
        const writer = decoded[res.locals.userNo];
        const title = req.body.title;
        const content = req.body.content;
        var sql = "INSERT INTO NOTICE (writer, title, content) VALUES(?, ?, ?);";
        const rows = db.query(sql, [writer, title, content]);
        next();
    } catch (err) {
        next(err);
    }
};

module.exports.listMiddleware = (req, res, next) => {
    try {
        const accessToken = req.cookies.token;
        const decoded = jwt.checkToken(accessToken, "access_token");
        var userGrade = 1;

        if(decoded)
            userGrade = decoded['grade'];

        var sql = "SELECT no, writer, title, date_format(dtCreate, '%Y.%m.%d %H:%i') `dtCreate` FROM NOTICE ORDER BY dtCreate DESC;";

        const rows = db.query(sql);
        var tempRows;
        const writerRows = [];

        rows.forEach(function (item) {
            sql = "SELECT nickname FROM USER WHERE no = ?;";
            tempRows = db.query(sql, [item.writer]);
            writerRows.push(tempRows[0].nickname);
        });

        res.render("noticeList", {
            title: "공지사항 - 평화나라",
            page: "noticeList",
            rows: rows,
            writerRows: writerRows,
            userGrade: userGrade,
            token: req.cookies.token
        });
        next();
    } catch (err) {
        next(err);
    }
};

module.exports.detailMiddleware = (req, res, next) => {
    try {
        const access_token = req.cookies.token;
        const decoded = jwt.checkToken(access_token, "access_token");

        if (decoded) {
            const sql = "SELECT * FROM NOTICE WHERE no = ?";
            const rows = db.query(sql, [req.params.no]);
            console.log("NOTICE Read No => " + rows[0].no);
            if (rows[0].writer == decoded["no"] && rows.length == 1) {
                res.render("noticeDetail", {
                    title: rows[0].title + " - 공지사항 - 평화나라",
                    page: "noticeDetail",
                    rows: rows,
                    writer: true,
                    token: req.cookies.token,
                });
            } else if (rows.length == 1) {
                res.render("noticeDetail", {
                    title: rows[0].title + " - 공지사항 - 평화나라",
                    page: "noticeDetail",
                    rows: rows,
                    writer: false,
                    token: req.cookies.token,
                });
            }
        } else {
            res.render("noticeDetail", {
                title: rows[0].title + " - 공지사항 - 평화나라",
                page: "noticeDetail",
                rows: rows,
                writer: false,
                token: req.cookies.token,
            });
        }
    } catch (err) {
        res.status(401).send({ error: "token expired" });
    }
};

module.exports.deleteMiddleware = (req, res, next) => {
    try {
        var sql = "SELECT writer FROM NOTICE WHERE no = ?";
        const writer = db.query(sql, [req.params.no]);

        if (writer == decoded[res.locals.userNo]) {
            sql = "DELETE FROM NOTICE WHERE no = ?";
            db.query(sql, [req.params.no]);
            next();
        }
    } catch (err) {
        next(err);
    }
};
