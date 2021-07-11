import express from "express";
import morgan from "morgan";
import session from "express-session"
import rootRouter from "./Routers/rootRouter"
import userRouter from "./Routers/userRouter"
import videoRouter from "./Routers/videoRouter"
import { localMiddleware } from "./middlewares";


const app = express();
const logger = morgan("dev");


app.set("view engine", "pug");
app.set("views", process.cwd() + '/src/views');
app.use(logger);
app.use(express.urlencoded({extend: true})); // HTML code 이해 (ex.req.body)

app.use(session({
    secret:"hello!",
    resave: true,
    saveUninitialized: true
})); // 브라우저가 BackEnd와 상호작용 할 때마다 session 미들웨어가 브라우저에게 쿠키를 전송
// 쿠키 : BackEnd가 브라우저에게 주는 정보
// 브라우저는 BackEnd에 Request할 때마다 쿠키를 덧붙임  
app.use((req, res, next) => {
    req.sessionStore.all((error, sessions) => {
      console.log(sessions);
      next();
    });
  });

app.use(localMiddleware);
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;

// server.js 의 기능 
// express 된 것과 server의 configuration에 관련된 코드만 처리함 