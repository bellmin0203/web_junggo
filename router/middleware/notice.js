const db = require("../../lib/db");
const jwt = require("../../lib/jwt");

module.exports.writeMiddleware = function (req, res, next) {
    try {
        const writer = res.locals.user.no;
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
            user: res.locals.user,
        });
        next();
    } catch (err) {
        next(err);
    }
};

module.exports.detailMiddleware = (req, res, next) => {
    try {
        const sql = "SELECT * FROM NOTICE WHERE no = ?";
        const rows = db.query(sql, [req.params.no]);
        console.log("NOTICE Read No => " + rows[0].no);

        if (req.cookies.token) {
            if (rows[0].writer == res.locals.user.no && rows.length == 1) {
                res.render("noticeDetail", {
                    title: rows[0].title + " - 공지사항 - 평화나라",
                    page: "noticeDetail",
                    rows: rows,
                    writer: true,
                    user: res.locals.user,
                });
            } else {
                res.render("noticeDetail", {
                    title: rows[0].title + " - 공지사항 - 평화나라",
                    page: "noticeDetail",
                    rows: rows,
                    writer: false,
                    user: res.locals.user,
                });
            }
        } else {
            res.render("noticeDetail", {
                title: rows[0].title + " - 공지사항 - 평화나라",
                page: "noticeDetail",
                rows: rows,
                writer: false,
                user: res.locals.user,
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

        if (writer == res.locals.user.no || res.locals.user.grade == 2) {
            sql = "DELETE FROM NOTICE WHERE no = ?";
            db.query(sql, [req.params.no]);
            next();
        }
    } catch (err) {
        next(err);
    }
};
