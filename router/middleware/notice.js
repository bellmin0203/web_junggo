const db = require("../../lib/db");
const jwt = require("../../lib/jwt");

module.exports.writeMiddleware = function (req, res, next) {
    try {
        const writer = res.locals.user.no;
        const title = req.body.title;
        const content = req.body.content;
        var sql = "INSERT INTO NOTICE (writer, title, content) VALUES(?, ?, ?);";
        const rows = db.query(sql, [writer, title, content]);
        console.log("공지사항 등록 완료");
        next();
    } catch (err) {
        next(err);
    }
};

module.exports.modifyMiddleware = (req, res, next) => {
    const rows = db.query("SELECT * FROM NOTICE WHERE no = ?", [req.params.no]);
    res.render("noticeModify", {
        title: "공지사항 글수정 - 평화나라",
        page: "noticeModify",
        user: res.locals.user,
        rows: rows,
        board_title: rows[0].title,
        content: rows[0].content,
    });
    next();
};

module.exports.updateMiddleware = (req, res, next) => {
    try {
        const title = req.body.title;
        const content = req.body.content;
        const no = req.params.no;
        const rows = db.query("UPDATE NOTICE SET title = ?, content = ? WHERE no = ?", [title, content, no]);
        console.log("공지사항 수정 완료");
        res.redirect(301, "/notice/detail/"+no);
        next();
    } catch (err) {
        next(err);
    }
};

const ONE_PAGE_CONTENT_COUNT = 10;
module.exports.listMiddleware = (req, res, next) => {
    try {
        var curPage = req.params.page === undefined? 1 : parseInt(req.params.page);
        var sql = "SELECT no, writer, title, date_format(dtCreate, '%Y.%m.%d %H:%i') `dtCreate` FROM NOTICE ORDER BY dtCreate ASC;";

        const rows = db.query(sql);
        const writerRows = [];
        var tempRows;

        const maxPage = Math.ceil(rows.length / ONE_PAGE_CONTENT_COUNT);
        const nextPages = [];
        const prevPages = [];
        const prevLimit = (maxPage - curPage) > 3 ? 3:(maxPage - curPage);
        for(var i = curPage-1; i>0; i--){
            prevPages.push(i);
            if(prevPages.length >= (6 - prevLimit)) break;
        }

        for(var i = curPage + 1; i<=maxPage; i++){
            nextPages.push(i);
            if(nextPages.length >= 6-prevPages.length) break;
        }

        const pageInfo = {
            maxPage: maxPage,
            nowPage: curPage,
            nextPages: nextPages,
            prevPages: prevPages.reverse(),
            onePageContent: ONE_PAGE_CONTENT_COUNT
        }

        rows.forEach(function (item) {
            sql = "SELECT nickname FROM USER WHERE no = ?;";
            tempRows = db.query(sql, [item.writer]);
            writerRows.push(tempRows[0].nickname);
        });

        res.render("noticeList", {
            title: "공지사항 - 평화나라",
            pageInfo: pageInfo,
            rows: rows,
            length: rows.length - 1,
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
