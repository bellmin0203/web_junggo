const express = require("express");
const login = require("./middleware/login");
const board = require("./middleware/board");
const router = express.Router();

router.get("/", (req, res) =>
  res.render("index", { title: "평화나라 - 중고 거래 사이트", token: req.cookies.token })
);
// 로그인
router.get("/login", (req, res) =>
  res.render("login", { title: "로그인 - 평화나라", page: "login", token: req.cookies.token })
);
router.post("/login", login.loginMiddleware, (req, res) =>
  res.render("login", { page: "login", token: req.cookies.token })
);
// 회원가입
router.get("/signup", (req, res) =>
  res.render("signup", { title: "회원가입 - 평화나라", page: "signup", token: req.cookies.token })
);
router.post("/signup", login.signupMiddleware, (req, res) =>
  res.render("signup", { page: "signup", token: req.cookies.token })
);
// 공지사항
router.get("/notice", board.noticeListMiddleware
    // res.redirect(301,'/notice/1');
);
router.get("/notice/:no", board.noticeDetailMiddleware
);
router.get("/noticeWrite", (req, res) =>
  res.render("noticeWrite", { title: "공지사항 글쓰기 - 평화나라", page: "noticeWrite", token: req.cookies.token, })
);
router.post("/noticeWrite", board.notiWriteMiddleware, (req, res) =>
  res.render("noticeList", { token: req.cookies.token })
);
// 매물목록
router.get("/goods", (req, res) =>
  res.render("goodsList", { title: "매물목록 - 평화나라", page: "goodsList" })
);
router.get("/goods/:no", (req, res) =>
  res.render("goodsDetail", { page: "goodsDetail", token: req.cookies.token })
);
// 내 매물
router.get("/my", (req, res) => res.render("my", { title: "내 매물 - 평화나라",  page: "my" }));
router.get("/detail", (req, res) => res.render("detail", { page: "detail" }));

router.get("/logout", login.logout, (req, res) =>
  res.render("logout", { page: "logout" })
);

module.exports = router;
