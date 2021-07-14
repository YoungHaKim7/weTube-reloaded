import bcrypt from "bcrypt";
import mongoose, { Mongoose } from "mongoose";

const userSchema = new mongoose.Schema({
    email: {type:String, required: true, unique:true},
    avatar_url: String,
    username: {type:String, required: true, unique:true},
    socialOnly: { type: Boolean, default: false },
    password: {type:String},
    name: {type:String, required: true},
    location: String
});

userSchema.pre('save', async function() {
    this.password = await bcrypt.hash(this.password, 5);
    // this.password: User의 password
})

const User = mongoose.model("User", userSchema);

export default User;