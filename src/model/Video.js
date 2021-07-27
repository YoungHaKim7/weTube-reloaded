import mongoose from "mongoose";

// export const formatHashtags = (hashtags) => hashtags.split(",").map(word => (word.startsWith("#") ? word : `#${word}`))

const videoSchema = new mongoose.Schema({
    title: {type: String, required:true, trim: true, maxLength: 20},
    fileUrl: {type: String, required: true},
    description: {type: String, required:true, trim: true, maxLength: 140},
    createdAt: {type:Date, required: true, default: Date.now},
    hashtags: [{ type: String }],
    meta: {
        views: {type:Number, required: true, default: 0},
    },
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"}
    // ref: ObjectId가 User에서 온다
});

videoSchema.static('formatHashtags', function (hashtags) {
    return hashtags.split(",").map((word) => (word.startsWith("#") ? word : `#${word}`));
});
// static: findById처럼 fuction을 만들 수 있음 | 따로 export 안함 

/* videoSchema.pre("save", async function() {
     this.hashtags = this.hashtags[0].split(",").map(word => (word.startsWith("#") ? word : `#${word}`))
 })
 hastags[0]: input에 입력된 값이 하나의 element로 array에 입력됨  
 MiddleWare: object가 생성, 저장 되기 전에 무언가를 먼저 하고 나머지를 처리할 수 있게 
 pre 미들웨어를 save 이벤트에 적용 */
 // pre 예시 : 유저 생성하고 생성하기 전에 비번 암호화 하기

const Video = mongoose.model("Video", videoSchema)
export default Video;

// Video.js 기능: mongoose에게 우리 어플리케이션의 데이터가 어떻게 생겼는 지 알려줌