const express = require("express");
const auth = require("./middleware/auth");
const login = require("./middleware/login");
const notice = require("./middleware/notice");
const router = express.Router();

router.get("/", auth.loginCheck, (req, res) => res.render("index", { title: "평화나라 - 중고 거래 사이트", token: req.cookies.token, user: res.locals.user }));
//
// 로그인
//
router.get("/login", (req, res) => res.render("login", { title: "로그인 - 평화나라", page: "login", token: req.cookies.token }));
router.post("/login", login.loginMiddleware, (req, res) => res.redirect(301, "/"));
//
// 회원가입
//
router.get("/signup", (req, res) => res.render("signup", { title: "회원가입 - 평화나라", page: "signup", token: req.cookies.token }));
router.post("/signup", login.signupMiddleware, (req, res) => res.redirect(301, "/"));
//
// 공지사항
//
router.get("/notice", auth.loginCheck, notice.listMiddleware);
router.get("/notice/:no", auth.loginCheck, notice.detailMiddleware);
router.get("/noticeWrite", auth.verifyToken, (req, res) => res.render("noticeWrite", { title: "공지사항 글쓰기 - 평화나라", page: "noticeWrite", token: req.cookies.token }));
router.post("/noticeWrite", auth.verifyToken, notice.writeMiddleware, (req, res) => res.redirect(301, "/notice"));
router.delete("/notice/:no", auth.verifyToken, notice.deleteMiddleware, (req, res) => res.redirect(301, "/notice"));
//
// 매물목록
//
router.get("/goods", auth.loginCheck, (req, res) => res.render("goodsList", { title: "매물목록 - 평화나라", page: "goodsList", token: req.cookies.token, user: res.locals.user }));
router.get("/goods/:no", (req, res) => res.render("goodsDetail", { page: "goodsDetail", token: req.cookies.token, user: res.locals.user }));
//
// 내 매물
//
router.get("/my", auth.verifyToken, (req, res) => res.render("my", { title: "내 매물 - 평화나라", page: "my", token: req.cookies.token, user: res.locals.user }));
router.get("/detail", (req, res) => res.render("detail", { page: "detail" }));

router.get("/logout", login.logout, (req, res) => res.status(200).redirect("/login"));

module.exports = router;
