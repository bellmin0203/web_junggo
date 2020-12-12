const jwt = require("jsonwebtoken");
const secret = "XD0FW221wEW8z4VV0awEA24VEdkl4EArW05cwWzDBTOsl4q5c";
// const access_token_expiration = "10m"; //10분
const access_token_expiration = "12h"; // 개발용

module.exports.createAccessToken = function (no, id, nickname, grade, dtCreate) {
    const payload = {
        // 토큰의 내용(payload)
        no: no,
        id: id,
        nickname: nickname,
        grade: grade,
        dtCreate: dtCreate,
        type: "access_token",
    };
    var token = jwt.sign(payload, secret, { expiresIn: access_token_expiration });
    return token;
};

module.exports.checkToken = function (token, type) {
    var decoded = false;
    try {
        decoded = jwt.verify(token, secret);
        if (decoded["type"] != type) return false;
    } catch (e) {
        console.log(e);
    }
    return decoded;
};
