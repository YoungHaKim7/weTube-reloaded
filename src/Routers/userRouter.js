import express from "express";
import { see, getEdit, postEdit, startGithubLogin, finishGithubLogin, startKakaoLogin,finishKakaoLogin, logout, getChangePassword, postChangePassword} from "../controllers/userController";
import { avatarUpload, protectorMiddleware, publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/kakao/start", publicOnlyMiddleware, startKakaoLogin);
userRouter.get("/kakao/finish", publicOnlyMiddleware, finishKakaoLogin);
userRouter.route("/change-password")
    .all(protectorMiddleware)
    .get(getChangePassword)
    .post(postChangePassword);
userRouter.route("/edit")
    .all(protectorMiddleware)
    .get(getEdit)
    .post(avatarUpload.single('avatar'), postEdit);
    // 파일 업로드, 파일명 변경, upload폴더에 저장, 정보를 postEdit에 전달
userRouter.get("/logout",protectorMiddleware ,logout);
userRouter.get("/:id", see)


export default userRouter;