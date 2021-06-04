import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {type: String, required:true, trim: true, maxLength: 20},
    description: {type: String, required:true, trim: true, maxLength: 140},
    createdAt: {type:Date, required: true, default: Date.now},
    hashtags: [{ type: String }],
    meta: {
        views: {type:Number, required: true, default: 0},
        rating: {type:Number, required: true, default: 0}
    }
});

videoSchema.pre("save", async function() {
    this.hashtags = this.hashtags[0].split(",").map(word => (word.startsWith("#") ? word : `#${word}`))
})

const Video = mongoose.model("Video", videoSchema);
export default Video;