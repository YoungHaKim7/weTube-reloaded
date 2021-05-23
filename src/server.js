import express from "express";
import morgan from "morgan";
import globalRouter from "./Routers/globalRouter"
import userRouter from "./Routers/userRouter"
import videoRouter from "./Routers/videoRouter"


const app = express();
const logger = morgan("dev");

console.log(process.cwd());

app.set("view engine", "pug");
app.set("views", process.cwd() + '/src/views');
app.use(logger);
app.use(express.urlencoded({extend: true}));
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

const handleListening = () => console.log("Server Listening on port 4000");
// 서버가 port 4000을 Listening 하고 있음
app.listen(4000, handleListening);
