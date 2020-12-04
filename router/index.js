const express = require('express');
const login = require('./middleware/login');
const router = express.Router();



router.get('/', (req, res) => res.render('index',{token:req.cookies.token}));

router.get('/login', (req, res) => res.render('login', {page: 'login',token:req.cookies.token}));
router.post('/login', login.loginMiddleware, (req, res) => res.render('login', {page: 'login',token:req.cookies.token}));

router.get('/signup', (req, res) => res.render('signup', {page: 'signup',token:req.cookies.token}));
router.post('/signup', login.signupMiddleware, (req, res) => res.render('signup', {page: 'signup',token:req.cookies.token}));

router.get('/notice', (req, res) => res.render('noticeList', {page: 'noticeList',token:req.cookies.token}));
router.get('/notice/:no',(req, res) => res.render('noticeDetail', {page: 'noticeDetail',token:req.cookies.token}));
router.get('/goods', (req, res) => res.render('goodsList', {page: 'goodsList'}));
router.get('/goods/:no', (req, res) => res.render('goodsDetail', {page: 'goodsDetail',token:req.cookies.token}));
router.get('/my',(req, res) => res.render('my', {page: 'my'}));
router.get('/detail', (req, res) => res.render('detail', {page: 'detail'}));

router.get('/logout', login.logout, (req, res) => res.render('logout', {page: 'logout'}));

module.exports = router;

// module.exports = (router) => {
//   router.get('/', user.create);
// }

