import User from "../model/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
import Video from "../model/Video";
import { query } from "express";

export const getJoin = (req, res) => res.render("join", {pageTitle: "Join"});
export const postJoin = async (req, res) => {
    const pageTitle = "join";
    const { email, username, password, password2, name, location } = req.body; 
    if (password !== password2) {
        req.flash("error", "password가 일치하지 않습니다");
        return res.status(400).render("join", {pageTitle});
    }
    const exists = await User.exists({ $or: [{username}, {email}]});
    if(exists) {
        req.flash("error", "This username/email is already taken")
        return res.status(400).render("join", {pageTitle})
    }
    try {
        await User.create({
            email, username, password, name, location
        });
        req.flash("info", "회원가입 완료");
        return res.redirect("/login")  
    } catch(error) {
        req.flash("error", error._message);
        return res.status(400).render("join", {pageTitle});
    }
    
} 
export const getLogin = (req, res) => res.render("login", {pageTitle:"login"});

export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const pageTitle = "login";
    const user = await User.findOne({username, socialOnly: false });
    if (!user) {
        req.flash("error", "해당 username이 없습니다");
        return res.status(400).render("login", {pageTitle});
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        req.flash("error", "비밀먼호가 일치하지 않습니다")
        return res.status(400).render("login", {pageTitle});
    }
    req.session.loggedIn = true;
    req.session.user = user; 
    return res.redirect("/"); 
}

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id:"6a980e6f0c759a0a433a",
        allow_signup:false,
        scope: "read:user user:email"
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`
    console.log("github start");

    return res.redirect(finalUrl);
}

export const finishGithubLogin = async (req, res) => {
    console.log("github finish");
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
    })).json();
    if("access_token" in tokenRequest) {
        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com"
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`
                }
        })).json();
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
                avatarUrl: userData.avatar_url,
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
            req.flash("error", "This username/email is already taken")
            return res.status(400).render("edit-profile", {
                pageTitle
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
    req.flash("info", "프로필이 수정되었습니다");
    return res.redirect(`/users/${_id}`);
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
        req.flash("error","현 비밀번호가 다릅니다");
        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password"
        });
    }
    if (NewPassword !== NewPasswordConfirm) {
        req.flash("error", "새 비밀번호가 다릅니다");
        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password"
        })
    }
    user.password = NewPassword;
    await user.save();
    req.session.user.password = user.password;
    req.flash("info", "비밀번호가 변경되었습니다");
    return res.redirect("/users/logout");
}

export const see = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate("videos").populate("owner");
    if (!user) {
        return res.status(404).render("404", {pageTitle: "User not found "})
    }  
    return res.render("users/profile", {pageTitle: user.name, user})
};

export const startKakaoLogin = async (req, res) => {
    const base_url =  "https://kauth.kakao.com/oauth/authorize";
    const config = {
        client_id:process.env.KA_CLIENTID,
        redirect_uri: "http://localhost:4000/users/kakao/finish",
        response_type: "code",
    }
    const params = new URLSearchParams(config).toString();
    const final_Url = `${base_url}?${params}`;
    console.log("kakao start")
    return res.redirect(final_Url);
}

export const finishKakaoLogin = async (req, res) => {
    console.log("kakao finish")
    const base_url = "https://kauth.kakao.com/oauth/token";
    const config = {
        grant_type: "authorization_code",
        client_id: process.env.KA_CLIENTID,
        redirect_uri: "http://localhost:4000/users/kakao/finish",
        code: req.query.code,	
    };
    const params = new URLSearchParams(config).toString();
    const final_Url = `${base_url}?${params}`;
    const tokenRequest = await (
        await fetch(final_Url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })).json();
    console.log(tokenRequest);
    if("access_token" in tokenRequest) {
        const { access_token } = tokenRequest;
        const api_url = "https://kapi.kakao.com/v2/user/me";
        const kakao_userData = await (
            await fetch(api_url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })).json();
            console.log(kakao_userData);
        const user_account = kakao_userData.kakao_account;
        let email = null;
        if(user_account.is_email_valid === true && user_account.is_email_verified === true) {
            email = user_account.email;
        }        
        if(!email) {
            return res.redirect("/login");
        }
        let user = await User.findOne({ email });
        if(!user) {
            user = await User.create({
                name: user_account.profile.nickname,
                email,
                avatarUrl: user_account.profile.profile_image_url,
                socialOnly: true,
                username: email.split("@")[0],
                password: "",
                location: "",
            })
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    } else {
        return res.redirect("/login");
    }
       
};
