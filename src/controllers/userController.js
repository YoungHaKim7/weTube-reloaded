import User from "../model/User";
import bcrypt from "bcrypt";

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
    const user = await User.findOne({username});
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
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
