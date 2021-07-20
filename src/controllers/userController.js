import User from "../model/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
import Video from "../model/Video";

export const getJoin = (req, res) => res.render("join", {pageTitle: "Join"});
export const postJoin = async (req, res) => {
    const pageTitle = "join";
    const { email, username, password, password2, name, location } = req.body; 
    if (password !== password2) {
        return res.status(400).render("join", {pageTitle , errorMessage: "password가 일치하지 않습니다"});
    }
    const exists = await User.exists({ $or: [{username}, {email}]});
    if(exists) {
        return res.status(400).render("join", {pageTitle , errorMessage: "This username/email is already taken."})
    }
    try {
        await User.create({
            email, username, password, name, location
        })  
        return res.redirect("/login")  
    } catch(error) {
        return res.status(400).render("join", {pageTitle , errorMessage: error._message});
    }
    
} 
export const getLogin = (req, res) => res.render("login", {pageTitle:"login"});

export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const pageTitle = "login";
    const user = await User.findOne({username, socialOnly: false });
    if (!user) {
        return res.status(400).render("login", {pageTitle, errorMessage:"해당 username이 없습니다"});
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.status(400).render("login", {pageTitle, errorMessage:"비밀먼호가 틀렸습니다"});
    }
    req.session.loggedIn = true;
    req.session.user = user; 
    return res.redirect("/"); 
}

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize"
    const config = {
        client_id:"6a980e6f0c759a0a433a",
        allow_signup:false,
        scope: "read:user user:email"
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`
    return res.redirect(finalUrl);
}

export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENTID,
        client_secret: process.env.GH_SECRET,
        code: req.query.code
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (
        await fetch(finalUrl, {
        method: "POST",
        headers: {
            Accept: "application/json"
        }
    })).json(); // .then 사용하는 대신 await ~ ).json() 사용
    if("access_token" in tokenRequest) {
        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com"
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`
                }
        })).json();
        console.log(userData)
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`
                }
        })).json();
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
        );
        if(!emailObj) {
            return res.redirect("/login");
        }
        let user = await User.findOne({ email: emailObj.email});
        if(!user) {
            user = await User.create({
                avatar_url: userData.avatar_url,
                email: emailObj.email,
                username: userData.login,
                password: "",
                name: "Unknown",
                socialOnly: true,
                location: userData.location
            });
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    } else {
        return res.redirect("/login");
    }
};

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
}

export const getEdit = (req, res) => {
    return res.render("edit-profile", {pageTitle: "Edit", user: req.session.user });
}
export const postEdit = async (req, res) => {
    const pageTitle = "Edit Profile";
    const { 
        session: {
            user: { _id, avatarUrl, email: sessionEmail, username: sessionUsername },
        },
        body: { name, email, username, location },
        file
    } = req;
    
    let searchParam = [];
    if (sessionEmail !== email) {
        searchParam.push({ email });
    }
    if (sessionUsername !== username) {
        searchParam.push({ username });
    }
    if (searchParam.length > 0) {
        const foundUser = await User.findOne({ $or: searchParam});
        if (foundUser && foundUser._id.toString() !== _id) {
            // id 비교 : email과 username이 내 것인지 타인의 것인지 확인
            return res.status(400).render("edit-profile", {
                pageTitle,
                errorMessage: "This username/email is already taken"
            });
        }
    }
    const updatedUser = await User.findByIdAndUpdate(_id, {
        avatarUrl: file ? file.path : avatarUrl,
        name,
        email, 
        username,
        location
    }, {
        new: true
    });
    req.session.user = updatedUser;
    return res.redirect("/users/edit");
}

export const getChangePassword = (req, res) => {
    if (req.session.user.socialOnly === true) {
        return res.redirect("/");
    }
    return res.render("users/change-password", {pageTitle: "Change Password"});
}

export const postChangePassword = async (req, res) => {
    const { 
        session: {
            user: { _id },
        },
        body: { OldPassword, NewPassword, NewPasswordConfirm }
    } = req;
    const user = await User.findById(_id);
    const ok = await bcrypt.compare(OldPassword, user.password);
    if (!ok) {
        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password",
            errorMessage: "현 비밀번호가 다릅니다"
        });
    }
    if (NewPassword !== NewPasswordConfirm) {
        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password",
            errorMessage: "새 비밀번호가 다릅니다"
        })
    }
    user.password = NewPassword;
    await user.save();
    req.session.user.password = user.password;
    return res.redirect("/users/logout");
}

export const see = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate("videos");
    if (!user) {
        return res.status(404).render("404", {pageTitle: "User not found "})
    }  
    return res.render("users/profile", {pageTitle: user.name, user})
}