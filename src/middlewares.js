import multer from "multer";

export const localMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "WeTube";
    res.locals.loggedInUser = req.session.user || {};
    // locals: template과 연결 가능
    console.log(res.locals)
    next();
}

export const protectorMiddleware = (req, res, next) => {
    if(req.session.loggedIn) {
        return next();
    } else {
        return res.redirect("/login");
    }
};  

export const publicOnlyMiddleware = (req, res, next) => {
    if(!req.session.loggedIn) {
        return next();
    } else {
        return res.redirect("/");
    }
};

export const avatarUpload = multer({ dest: 'uploads/avatars/', limits: {
    fileSize: 3000
} });

export const videoUpload = multer({ dest: "uploads/videos/", limits: {
    fileSize: 100000000
}})
