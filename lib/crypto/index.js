const crypto = require('crypto');
// 패스워드 암호화 모듈
module.exports.hash = function(pw){
    return crypto.createHash('sha512').update(pw+process.env.SECRET).digest('base64');
}