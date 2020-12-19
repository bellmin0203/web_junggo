const db = require("../../lib/db");
const jwt = require("../../lib/jwt");
// 매물등록 준비 (DB에 저장되있는 카테고리와 지역 조회)
module.exports.goodsWriteMiddleware = function (req, res, next) {
    let category = db.query("SELECT id,strName FROM CATEGORY");
    res.locals.category = category;

    city = db.query("SELECT id,strName FROM CITY_TYPE");
    res.locals.city = city;
    next();
};
// 매물등록
module.exports.goodsWriteInsertMiddleware = function (req, res, next) {
    const decoded = jwt.checkToken(req.cookies.token, "access_token");
    const { price, category, city, title, content } = req.body;
    const photo = req.file.filename;
    const params = [decoded["no"], title, content, price, photo, category, city];
    const result = db.query("INSERT INTO BOARD (writer, title, content, price, photo, status, category, city) VALUES (?, ?, ?, ?, ?, 1, ?, ?)", params);
    return res.redirect(301, "/");
};

const ONE_PAGE_CONTENT_COUNT = 10;  // 한 페이지에 출력되는 게시물 개수
// 매물 목록 조회
module.exports.goodsListMiddleware = function (req, res, next) {
    const page = req.params.page === undefined ? 1 : parseInt(req.params.page);

    const goods = db.query(
        "\
    SELECT b.`no`, u.nickname `writer`, title, content, price, bs.strName `status`, c.strName `category`, ct.strName `city`, photo FROM BOARD b\
	LEFT JOIN `USER`u ON u.`no` = b.writer\
	LEFT JOIN BOARD_STATUS bs ON b.status = bs.id\
	LEFT JOIN CITY_TYPE ct ON b.city = ct.id\
    LEFT JOIN CATEGORY c ON b.category = c.id\
    LIMIT ?, ?;\
    ",
        [(page - 1) * ONE_PAGE_CONTENT_COUNT, ONE_PAGE_CONTENT_COUNT]
    );
    const rows = db.query("SELECT count(*) 'count' FROM BOARD");
    const maxPage = Math.ceil(rows[0].count / ONE_PAGE_CONTENT_COUNT); // 최대 페이지 수
    const nextPages = [];
    const prevPages = [];
    const prevLimit = maxPage - page > 3 ? 3 : maxPage - page; // 현재페이지를 기준으로 이전페이지, 다음페이지 각각 3개씩만 출력
    for (var i = page - 1; i > 0; i--) {
        prevPages.push(i);
        if (prevPages.length >= 6 - prevLimit) break;
    }

    for (var i = page + 1; i <= maxPage; i++) {
        nextPages.push(i);
        if (nextPages.length >= 6 - prevPages.length) break;
    }

    const pageInfo = {
        maxPage: maxPage,
        nowPage: page,
        nextPages: nextPages,
        prevPages: prevPages.reverse(),
        onePageContent: ONE_PAGE_CONTENT_COUNT,
    };
    res.locals.goods = goods;
    res.locals.pageInfo = pageInfo;
    next();
};

/* GET '/' => 최근 중고 매물 */
module.exports.recentlyGoods = (req, res, next) => {
    const recGoods = db.query("SELECT no, title, price, photo FROM BOARD ORDER BY dtCreate DESC LIMIT 8");  // 등록날짜 내림차순 최대 8개 조회
    res.locals.goods = recGoods;
    next();
};

/* GET '/' => 인기 검색어 */
module.exports.searchTop = (req, res, next) => {
    const searchHis = db.query("SELECT word FROM SEARCH_HISTORY ORDER BY count DESC, word LIMIT 5;");   // 검색 기록 회수 내림차순 최대 5개 조회
    res.locals.searchHis = searchHis;
    next();
};

/* GET '/search' => 검색 이벤트 */
module.exports.search = (req, res, next) => {
    const word = req.query.word;
    const searchWord = word.replace(" ", "|"); // MySQL의 REGEXP 정규식을 사용하기 위해 공백을 '|' 문자로 치환
    const page = req.params.page === undefined ? 1 : parseInt(req.params.page);
    // 제목과 내용에 검색어가 포함되어 있는 게시물을 모두 조회
    const goods = db.query(
        "\
    SELECT b.`no`, u.nickname `writer`, title, content, price, bs.strName `status`, c.strName `category`, ct.strName `city`, photo FROM BOARD b\
    LEFT JOIN `USER`u ON u.`no` = b.writer\
  	LEFT JOIN BOARD_STATUS bs ON b.status = bs.id\
  	LEFT JOIN CITY_TYPE ct ON b.city = ct.id\
    LEFT JOIN CATEGORY c ON b.category = c.id\
    WHERE b.title REGEXP ? OR b.content REGEXP ?\
    LIMIT ?, ?;\
    ",
        [searchWord, searchWord, (page - 1) * ONE_PAGE_CONTENT_COUNT, ONE_PAGE_CONTENT_COUNT]
    );
    // 페이징 처리
    const rows = db.query("SELECT count(*) 'count' FROM BOARD");
    const maxPage = Math.ceil(rows[0].count / ONE_PAGE_CONTENT_COUNT);
    const nextPages = [];
    const prevPages = [];
    const prevLimit = maxPage - page > 3 ? 3 : maxPage - page;
    for (var i = page - 1; i > 0; i--) {
        prevPages.push(i);
        if (prevPages.length >= 6 - prevLimit) break;
    }

    for (var i = page + 1; i <= maxPage; i++) {
        nextPages.push(i);
        if (nextPages.length >= 6 - prevPages.length) break;
    }
    const pageInfo = {
        maxPage: maxPage,
        nowPage: page,
        nextPages: nextPages,
        prevPages: prevPages.reverse(),
        onePageContent: ONE_PAGE_CONTENT_COUNT,
    };

    res.locals.goods = goods;
    res.locals.pageInfo = pageInfo;
    // 검색 기록 DB 저장
    const search = db.query("SELECT * FROM SEARCH_HISTORY WHERE word = ?", [word]);
    if (search.length == 1) {   // 이미 있는 검색 기록이면 count 증가
        var count = parseInt(search[0].count) + 1;
        console.log("검색 : " + word);
        db.query("UPDATE SEARCH_HISTORY SET count = ? WHERE id = ?", [count, search[0].id]);
        next();
    } else {    // 처음 검색되는 단어이면 DB 삽입
        console.log("검색 : " + word);
        db.query("INSERT INTO SEARCH_HISTORY(word) VALUES(?)", [word]);
        next();
    }
};
// 매물 상세보기
module.exports.goodsDetailMiddleware = (req, res, next) => {
    const no = req.params.no;
// 해당 매물 조회
    const goods = db.query(
        "\
    SELECT b.`no`, u.nickname `writer`, title, content, price, bs.strName `status`, c.strName `category`, ct.strName `city`, photo FROM BOARD b\
    LEFT JOIN `USER`u ON u.`no` = b.writer\
  	LEFT JOIN BOARD_STATUS bs ON b.status = bs.id\
  	LEFT JOIN CITY_TYPE ct ON b.city = ct.id\
    LEFT JOIN CATEGORY c ON b.category = c.id\
    WHERE b.no=?\
    ",
        [no]
    );
// 해당 매물의 댓글 조회
    const comment = db.query(
        `SELECT c.no, c.dtUpdate, c.content, c.writer, u.nickname 'writerNickName'
    FROM COMMENT c
    LEFT JOIN USER u ON u.no = c.writer
    WHERE c.board_no=?
    `,
        [no]
    );

    res.locals.goods = goods[0];
    res.locals.comments = comment;
    next();
};
// 댓글 등록
module.exports.postComment = (req, res) => {
    const user = res.locals.user;
    const boardNo = req.params.no;
    const content = req.body.content;
    const result = db.query("INSERT INTO COMMENT (board_no, content, writer) VALUES (?, ?, ?)", [boardNo, content, user.no]);
    res.redirect("/goodsDetail/" + req.params.no);
};
// 댓글 삭제
module.exports.deleteComment = (req, res) => {
    const user = res.locals.user;
    const bNo = req.params.bno;
    const cNo = req.params.cno;
    const result = db.query("DELETE FROM COMMENT WHERE writer=? AND no=? AND board_no=?", [user.no, cNo, bNo]);
    res.send("ok");
};

/* GET 내 매물 */
module.exports.myGoodsList = (req, res, next) => {
    const user = res.locals.user;

    const goods = db.query(
        "\
    SELECT b.`no`, title, b.content, price, bs.strName `status`, photo, b.dtUpdate, COUNT(cm.no) 'commentCount' FROM BOARD b\
  	LEFT JOIN BOARD_STATUS bs ON b.status = bs.id\
  	LEFT JOIN COMMENT cm ON b.no = cm.board_no\
    WHERE b.writer=?\
    GROUP BY b.no\
    ",
        [user.no]
    );

    res.locals.goods = goods;
    next();
};
