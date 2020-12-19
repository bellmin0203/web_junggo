const jwt = require("../../lib/jwt");
// JWT 토큰 인증 (로그인이 반드시 필요한 기능 호출 시 토큰 검사 후 사용자 정보 전달)
module.exports.verifyToken = (req, res, next) => {
    try {
        const accessToken = req.cookies.token;  // 쿠키에 저장된 토큰으로 인증
        const decoded = jwt.checkToken(accessToken, "access_token");

        if (decoded) {
            res.locals.user = decoded;  // 유저정보 저장
            next();
        } else {
            // res.status(401).send({ error: 'unauthorized' });
            res.status(401).send('<script type="text/javascript">alert("로그인을 해주세요!"); history.back();</script>');
        }
    } catch (err) {
        res.status(401).json({ error: "token expired" });
    }
};
// 로그인이 되어있는지만 체크
module.exports.loginCheck = (req, res, next) => {
    if (req.cookies.token) {
        const accessToken = req.cookies.token;
        const decoded = jwt.checkToken(accessToken, "access_token");
        if (decoded) {
            res.locals.user = decoded;
            next();
        }
    } else {
        next();
    }
};
