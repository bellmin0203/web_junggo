const db = require("../../lib/db");
const jwt = require("../../lib/jwt");

module.exports.notiWriteMiddleware = function (req, res, next) {
  var accessToken = req.cookies.token;
  var decoded = jwt.checkToken(accessToken, "access_token");
  if (decoded) {
    try {
      const writer = decoded["no"];
      const title = req.body.title;
      const content = req.body.content;
      var sql = "INSERT INTO NOTICE (writer, title, content) VALUES(?, ?, ?);";
      const rows = db.query(sql, [writer, title, content]);
      console.log(rows);
      return res.redirect(301, "/notice");
    } catch (e) {
      res.status(500).send({ error: "fail" });
    }
  } else res.status(401).send({ error: "invalid_token" });
  next();
};

module.exports.noticeListMiddleware = (req, res, next) => {
    var sql = "SELECT no, writer, title, date_format(dtCreate, '%Y.%m.%d %H:%i') `dtCreate` FROM NOTICE ORDER BY dtCreate DESC;";
    const rows = db.query(sql);
    var tempRows;
    const writerRows = [];

    rows.forEach(function(item){
      sql = "SELECT nickname FROM USER WHERE no = ?;";
      tempRows = db.query(sql, [item.writer]);
      writerRows.push(tempRows[0].nickname);
    });
    
    res.render("noticeList", { title: "공지사항 - 평화나라", page: "noticeList", rows: rows, writerRows: writerRows });
    next();
};

module.exports.noticeDetailMiddleware = (req, res, next) => {
  var sql = "SELECT * FROM NOTICE WHERE no = ?";
  const rows = db.query(sql, [req.params.no]);
  console.log(rows[0].title);
  if(rows.length == 1){
    try{
      res.render("noticeDetail", { title: rows[0].title+" - 공지사항 - 평화나라", page: "noticeDetail", rows: rows, token: req.cookies.token })
    }
    catch(e){
      res.status(500).send("Server Error!");
    }
  } else res.status(404).send("File Not Found");
  next();
}

module.exports.noticeDeleteMiddleware = (req, res, next) => {
  var sql = "DELETE FROM NOTICE WHERE no = ?";
  const rows = db.query(sql, [req.params.no]);
  return res.redirect(301,'/notice');
  next();
}
