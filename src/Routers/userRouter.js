import express from "express";
import { edit, remove, startGithubLogin, finishGithubLogin, logout} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/edit", edit);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get("/logout", logout);


export default userRouter;