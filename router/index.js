const express = require("express");
const multer = require("multer");
const auth = require("./middleware/auth");
const login = require("./middleware/login");
const goods = require("./middleware/goods");
const notice = require("./middleware/notice");

const router = express.Router();

//UPLOAD
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "images");
        },
        filename: function (req, file, cb) {
            var fileName = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < 48; i++) fileName += possible.charAt(Math.floor(Math.random() * possible.length));
            cb(null, fileName);
        },
    }),
});

router.get("/", auth.loginCheck, goods.recentlyGoods, (req, res) => res.render("index", { title: "평화나라 - 중고 거래 사이트", user: res.locals.user, recGoods: res.locals.goods }));
//
// 로그인
//
router.get("/login", (req, res) => res.render("login", { title: "로그인 - 평화나라", page: "login", user: res.locals.user }));
router.post("/login", login.loginMiddleware, (req, res) => res.redirect(301, "/"));

/* 로그아웃 */
router.get("/logout", login.logout, (req, res) => res.status(200).redirect("/login"));

//
// 회원가입
//
router.get("/signup", (req, res) => res.render("signup", { title: "회원가입 - 평화나라", page: "signup", user: res.locals.user }));
router.post("/signup", login.signupMiddleware, (req, res) => res.redirect(301, "/"));

//
// 공지사항
//
router.get("/notice", (req, res) => res.redirect(301, "/notice/1"));
router.get("/notice/:page", auth.loginCheck, notice.listMiddleware);
router.get("/notice/detail/:no", auth.loginCheck, notice.detailMiddleware);

/* 공지사항 글쓰기 */
router.get("/noticeWrite", auth.verifyToken, (req, res) =>
    res.render("noticeWrite", {
        title: "공지사항 글쓰기 - 평화나라",
        page: "noticeWrite",
        user: res.locals.user,
    })
);
router.post("/noticeWrite", auth.verifyToken, notice.writeMiddleware, (req, res) => res.redirect(301, "/notice"));
router.post("/uploadImage/notice", upload.single("file"), (req, res) => res.send("/images/" + req.file.filename));

/* 공지사항 삭제 */
router.delete("/notice/:no", auth.verifyToken, notice.deleteMiddleware, (req, res) => res.redirect(301, "/notice"));

/* 공지사항 수정 */
router.post("/notice/:no", auth.verifyToken, notice.modifyMiddleware);
router.put("/notice/update/:no", auth.verifyToken, notice.updateMiddleware);

//
// 매물목록
//
router.get("/goods", auth.loginCheck, goods.goodsListMiddleware, (req, res) =>
    res.render("goodsList", {
        title: "매물목록 - 평화나라",
        page: "goodsList",
        user: res.locals.user,
        pageInfo: res.locals.pageInfo,
        goods: res.locals.goods,
    })
);

router.get("/goods/:page", auth.loginCheck, goods.goodsListMiddleware, (req, res) =>
    res.render("goodsList", {
        title: "매물목록 - 평화나라",
        page: "goodsList",
        user: res.locals.user,
        pageInfo: res.locals.pageInfo,
        goods: res.locals.goods,
    })
);


router.get("/goodsDetail/:no", auth.loginCheck, goods.goodsDetailMiddleware, (req, res) =>
    res.render("goodsDetail", {
        title: "매물상세 - 평화나라",
        page: "goodsDetail",
        user: res.locals.user,
        goods: res.locals.goods,
    })
);

//
// 매물등록
//
router.get("/goodsWrtie", auth.verifyToken, goods.goodsWriteMiddleware, (req, res) =>
    res.render("goodsWrite", {
        title: "매물등록 - 평화나라",
        page: "goodsList",
        user: res.locals.user,
        category: res.locals.category,
    })
);
router.post("/goodsWrite", upload.single("photo"), goods.goodsWriteInsertMiddleware);

router.get("/goods/:no", auth.loginCheck, (req, res) => res.render("goodsDetail", { page: "goodsDetail", user: res.locals.user }));
//
// 내 매물
//
router.get("/my", auth.verifyToken, (req, res) =>
    res.render("my", {
        title: "내 매물 - 평화나라",
        page: "my",
        user: res.locals.user,
    })
);
router.get("/detail", (req, res) => res.render("detail", { page: "detail" }));

//
// 프로필
//
router.get("/profile", auth.verifyToken, (req, res) =>
    res.render("profile", {
        title: "회원정보 - 평화나라",
        page: "profile",
        user: res.locals.user,
    })
);
router.post("/profile/:no", auth.verifyToken, login.profileModify);
router.put("/profile/update/:no", auth.verifyToken, login.profileUpdate, (req, res) => res.redirect(301, "/profile"));

module.exports = router;
