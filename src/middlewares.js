export const localMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "WeTube";
    res.locals.loggedInUser = req.session.user;
    // locals: template과 연결 가능
    console.log(res.locals)
    next();
}