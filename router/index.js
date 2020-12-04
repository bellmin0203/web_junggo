const express = require('express');
const login = require('./middleware/login');
const router = express.Router();



router.get('/', (req, res) => res.render('index'));

router.get('/login', (req, res) => res.render('login', {page: 'login'}));
router.post('/login', login.loginMiddleware, (req, res) => res.render('login', {page: 'login'}));

router.get('/signup', (req, res) => res.render('signup', {page: 'signup'}));
router.post('/signup', login.signupMiddleware, (req, res) => res.render('signup', {page: 'signup'}));

router.get('/notice', (req, res) => res.render('noticeList', {page: 'noticeList'}));
router.get('/notice/:no',(req, res) => res.render('noticeDetail', {page: 'noticeDetail', no: req.params.no}));
router.get('/goods', (req, res) => res.render('goodsList', {page: 'goodsList'}));
router.get('/goods/:no', (req, res) => res.render('goodsDetail', {page: 'goodsDetail', no: req.params.no}));
router.get('/my',(req, res) => res.render('my', {page: 'my'}));
router.get('/detail', (req, res) => res.render('detail', {page: 'detail'}));

module.exports = router;

// module.exports = (router) => {
//   router.get('/', user.create);
// }

