const express = require('express');
const router = express.Router();
// const user = require('./user');

router.get('/', (req, res) => res.render('index'));
router.get('/login', (req, res) => res.render('login', {page: 'login'}));
router.get('/signup', (req, res) => res.render('signup', {page: 'signup'}));
router.get('/notice', (req, res) => res.render('noticeList', {page: 'noticeList'}));
router.get('/notice/:no', (req, res) => res.render('noticeDetail', {page: 'noticeDetail'}));
router.get('/goods', (req, res) => res.render('goodsList', {page: 'goodsList'}));
router.get('/goods/:no', (req, res) => res.render('goodsDetail', {page: 'goodsDetail'}));
router.get('/my', (req, res) => res.render('my', {page: 'my'}));
router.get('/detail', (req, res) => res.render('detail', {page: 'detail'}));

module.exports = router;

// module.exports = (router) => {
//   router.get('/', user.create);
// }
