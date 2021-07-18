import express from "express";
import morgan from "morgan";
import session from "express-session"
import MongoStore from 'connect-mongo'
import rootRouter from "./Routers/rootRouter"
import userRouter from "./Routers/userRouter"
import videoRouter from "./Routers/videoRouter"
import { localMiddleware } from "./middlewares";
import { Mongoose } from "mongoose";


const app = express();
const logger = morgan("dev");


app.set("view engine", "pug");
app.set("views", process.cwd() + '/src/views');
app.use(logger);
app.use(express.urlencoded({extend: true})); // HTML code 이해 (ex.req.body)
app.use(session({
    // session id는 쿠키에 저장, session data는 서버에 저장 
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    // false: req.session 속 값을 수정하는 그 순간에 세션을 Store에 저장 후 그제야 쿠키를 전달한다.
    // ie. 로그인 할 때만 쿠키 부여
    store: MongoStore.create({ mongoUrl : process.env.DB_URL})
    // 위 문장 없으면 server 메모리에 저장, 서버가 재시작 되면 메모리 초기화 
    // session을 만드는 방법: 새로고침(브라우저가 Backend에 요청할 때)
    // mongoUrl이 코드에 보이면 안되는 이유: db에 정보가 들어있기 때문에
})); 
// 브라우저가 BackEnd와 상호작용 할 때마다 session 미들웨어가 브라우저에게 쿠키(id)를 전송
// 쿠키 : BackEnd가 브라우저에게 주는 정보
// 브라우저는 BackEnd에 Request할 때마다 쿠키를 덧붙임  

app.use(localMiddleware);
app.use("/uploads", express.static("uploads")); // 폴더를 브라우저에 노출
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;

// server.js 의 기능 
// express 된 것과 server의 configuration에 관련된 코드만 처리함 

/*
{ 
  "_id" : "bBVqWMLvJ53VesCj-EyjR41Iv__7LjuP", 
  "expires" : ISODate("2021-07-25T08:47:53.153Z"), 
  "session" : "{
    \"cookie\":{
      \"originalMaxAge\":null,
      \"expires\":null,
      \"httpOnly\":true,
      \"path\":\"/\"
    },
    \"loggedIn\":true,
    \"user\":{
      \"_id\":\"60eaa2ef068b533ef082e2bd\",
      \"email\":\"yusd1d@naver.com\",
      \"username\":\"ccc\",
      \"password\":\"$2b$05$Y3QWnXXdYSb3FEtqrd/RvebPzGb68E7d4zkvlj4eQyQMHRlZ1dKCe\",
      \"name\":\"비번은 123 아이디 ccc\",
      \"location\":\"df\",
      \"__v\":0}
    }" 
  }

*/