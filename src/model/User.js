import bcrypt from "bcrypt";
import mongoose, { Mongoose } from "mongoose";

const userSchema = new mongoose.Schema({
    email: {type:String, required: true, unique:true},
    avatarUrl: {type: String, default: "https://cdn.pixabay.com/photo/2018/11/13/21/43/instagram-3814049_960_720.png"},
    username: {type:String, required: true, unique:true},
    socialOnly: { type: Boolean, default: false },
    password: {type:String},
    name: {type:String, required: true},
    location: String,
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video"}],
    comment: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment"}],
});

userSchema.pre('save', async function() {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 5);
    }
    // this.password: User의 password
})

const User = mongoose.model("User", userSchema);

export default User;