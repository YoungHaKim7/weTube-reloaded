import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
//127.0.0.1:27017/
const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connected to DB")
const handleError = (error) => console.log("❌ DB error", error);
db.on("error", handleError); 
db.once("open", handleOpen);

// Window Terminal에서 Error: couldn't connect to server 127.0.0.1:27017이 발생하면 
// mongod 입력, 또 다른 Terminal에서 mongo 실행