const jwt = require("../../lib/jwt");

const verifyToken = (req, res, next) => {
    try {
        const accessToken = req.cookies.token;
        const decoded = jwt.checkToken(accessToken, "access_token");

        if(decoded){
            res.locals.userNo = decoded['no'];
            next();
        } else {
            res.status(401).send({ error: 'unauthorized' });
        }
    } catch (err) {
        res.status(401).json({ error: 'token expired' });
    }
};

exports.verifyToken = verifyToken;