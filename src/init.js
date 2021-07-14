import "dotenv/config"
import "./db"
import "./model/Video"
import "./model/User"
import app from "./server"

const PORT = 4000;

const handleListening = () => console.log("✅ Server Listening on port 4000");
// 서버가 port 4000을 Listening 하고 있음
app.listen(PORT, handleListening);
