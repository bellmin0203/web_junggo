

module.exports.loginMiddleware = function(req, res, next){
    const id = req.body.id;
    const pw = req.body.pw;
    next();
}

module.exports.signupMiddleware = function(req, res, next){
    const id = req.body.id;
    const pw = req.body.pw;
    next();
}
