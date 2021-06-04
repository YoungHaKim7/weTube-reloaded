import express from "express";
import morgan from "morgan";
import globalRouter from "./Routers/globalRouter"
import userRouter from "./Routers/userRouter"
import videoRouter from "./Routers/videoRouter"


const app = express();
const logger = morgan("dev");


app.set("view engine", "pug");
app.set("views", process.cwd() + '/src/views');
app.use(logger);
app.use(express.urlencoded({extend: true}));
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;

// server.js 의 기능 
// express 된 것과 server의 configuration에 관련된 코드만 처리함 