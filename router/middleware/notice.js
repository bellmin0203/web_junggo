const db = require("../../lib/db");
const jwt = require("../../lib/jwt");

// 공지사항 INSERT
module.exports.writeMiddleware = function (req, res, next) {
    const writer = res.locals.user.no;
    const title = req.body.title;
    const content = req.body.content;
    var sql = "INSERT INTO NOTICE (writer, title, content) VALUES(?, ?, ?);";
    const rows = db.query(sql, [writer, title, content]);
    console.log("공지사항 등록 완료");
    next();
};

// 공지사항 수정화면
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

// 공지사항 UPDATE
module.exports.updateMiddleware = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    const no = req.params.no;
    const rows = db.query("UPDATE NOTICE SET title = ?, content = ? WHERE no = ?", [title, content, no]);
    console.log("공지사항 수정 완료");
    res.redirect(301, "/notice/detail/" + no);
    next();
};

const ONE_PAGE_CONTENT_COUNT = 10; // 한 페이지에 출력할 최대 게시물 개수

// 공지사항 SELECT
module.exports.listMiddleware = (req, res, next) => {
    var curPage = req.params.page === undefined ? 1 : parseInt(req.params.page);

    var sql = "SELECT n.`no`, u.nickname `writer`, title,\
        date_format(n.dtCreate, '%Y.%m.%d %H:%i') `dtCreate`\
        FROM NOTICE n LEFT JOIN USER u ON u.`no` = n.writer;";

    const notice = db.query(sql);

    const maxPage = Math.ceil(notice.length / ONE_PAGE_CONTENT_COUNT); // 최대 페이지 개수
    const nextPages = [];
    const prevPages = [];
    const prevLimit = maxPage - curPage > 3 ? 3 : maxPage - curPage; // 현재페이지를 기준으로 이전페이지, 다음페이지 각각 3개씩만 출력
    for (var i = curPage - 1; i > 0; i--) {
        prevPages.push(i);
        if (prevPages.length >= 6 - prevLimit) break;
    }

    for (var i = curPage + 1; i <= maxPage; i++) {
        nextPages.push(i);
        if (nextPages.length >= 6 - prevPages.length) break;
    }

    const pageInfo = {
        maxPage: maxPage,
        nowPage: curPage,
        nextPages: nextPages,
        prevPages: prevPages.reverse(),
        onePageContent: ONE_PAGE_CONTENT_COUNT,
    };

    res.render("noticeList", {
        title: "공지사항 - 평화나라",
        pageInfo: pageInfo,
        notice: notice,
        length: notice.length - 1,
        user: res.locals.user,
    });
    next();
};

// 공지사항 상세보기
module.exports.detailMiddleware = (req, res, next) => {
    const sql = "SELECT * FROM NOTICE WHERE no = ?";
    const rows = db.query(sql, [req.params.no]);
    console.log("NOTICE Read No => " + rows[0].no);

    if (req.cookies.token) {
        // 로그인한 사용자일 경우
        if (rows[0].writer == res.locals.user.no && rows.length == 1) {
            // 글 작성자인 경우
            res.render("noticeDetail", {
                title: rows[0].title + " - 공지사항 - 평화나라",
                page: "noticeDetail",
                rows: rows,
                writer: true,
                user: res.locals.user,
            });
        } else {
            // 로그인한 사용자지만 글 작성자가 아닌 경우
            res.render("noticeDetail", {
                title: rows[0].title + " - 공지사항 - 평화나라",
                page: "noticeDetail",
                rows: rows,
                writer: false,
                user: res.locals.user,
            });
        }
    } else {
        // 비로그인 사용자
        res.render("noticeDetail", {
            title: rows[0].title + " - 공지사항 - 평화나라",
            page: "noticeDetail",
            rows: rows,
            writer: false,
            user: res.locals.user,
        });
    }
};

// 공지사항 삭제
module.exports.deleteMiddleware = (req, res, next) => {
    var sql = "SELECT writer FROM NOTICE WHERE no = ?";
    const writer = db.query(sql, [req.params.no]);
    
    // 작성자이거나 관리자인 경우 삭제 가능
    if (writer == res.locals.user.no || res.locals.user.grade == 2) {
        sql = "DELETE FROM NOTICE WHERE no = ?";
        db.query(sql, [req.params.no]);
        next();
    }
};