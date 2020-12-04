const crypto = require('crypto');

module.exports.hash = function(pw){
    return crypto.createHash('sha512').update(pw+process.env.SECRET).digest('base64');
}