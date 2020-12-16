const jwt = require("../../lib/jwt");

module.exports.verifyToken = (req, res, next) => {
    try {
        const accessToken = req.cookies.token;
        const decoded = jwt.checkToken(accessToken, "access_token");
        
        if(decoded){
            res.locals.user = decoded;
            next();
        } else {
            res.status(401).send({ error: 'unauthorized' });
        }
    } catch (err) {
        res.status(401).json({ error: 'token expired' });
    }
};

module.exports.loginCheck = (req, res, next) => {
    if(req.cookies.token){
        const accessToken = req.cookies.token;
        const decoded = jwt.checkToken(accessToken, "access_token");
        if(decoded){
            res.locals.user = decoded;
            next();
        }
    } else {
        next();
    }
}