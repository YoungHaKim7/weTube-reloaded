import Video, {formatHashtags} from "../model/Video";

/* 
<----- CallBack fuction ------> 
console.log("i start"); // 1
Video.find({}, (error, videos) => {
    if(error) {
        return res.render("server-error");
    }
    return res.render("home", {pageTitle : "Home", title : "Hello", videos:[]}); // 3
});
console.log("i finished"); //2 
콜백함수는 함수가 실행될때까지 기다리는 동안 다른 실행문이 실행됨
promise는 함수가 실행될때까지 기다림 (다른 실행문도 기다림)
*/

export const home = async(req, res) => {
    try {
        const videos =  await Video.find({}).sort({ createdAt : "desc"})
        // console.log(videos);
        return res.render("home", {pageTitle : "Home", title : "Hello", videos});
    }
    catch {
        return res.render("search-error")
    }
    
} 
export const getEdit = async (req, res) => {
    const { id } = req.params; //ES6 version / it's same "const id = req.params.id;"
    const video = await Video.findById(id);
    // getEdit에서는 exists를 못쓰고 findById 사용 : video Object가 필요하기 때문
    if (!video) {
        return res.render("404", {pageTitle: "Video is not found"});
    }
    return res.render("edit", {pageTitle: `Editing: ${video.title} `, video})
}
export const postEdit = async (req, res) => {
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.exists({ _id:id}); 
    // exists(filter): video Object를 받는 대신 True or Flase를 return 받음 
    if (!video) {
        return res.status(404).render("404", {pageTitle: "Video is not found"});
    }
    await Video.findByIdAndUpdate(id, {
        title, description, hashtags: Video.formatHashtags(hashtags)
    })
    return res.redirect(`/videos/${id}`);
}
export const watch = async (req, res) => {
    const { id } = req.params; // id 는 req.params에서 오는 것 기억하기
    const video = await Video.findById(id);
    if(!video) {
        return res.status(404).render("404", {pageTitle: "Video is not found"});
    }
    return res.render("watch", {pageTitle: video.title, video});
}
export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle : "Upload Video"})
}

export const postUpload = async (req, res) => {
    const { title, description, hashtags } = req.body;
    try{
        await Video.create({
            title, 
            description,
            hashtags: Video.formatHashtags(hashtags)
        });
        return res.redirect("/")    
    }
    // await ~.create : 데이터를 만들고 저장까지 함
    catch (error) {
        return res.render("upload", {pageTitle : "Upload Video", errorMessage: error})
    }
    
}

export const deleteVideo = async (req, res) => {
    const { id } = req.params;
    await Video.findByIdAndDelete(id) 
    // findByIdAndRemove도 있지만 되도록 Delete 사용
    return res.redirect("/");
}

export const search = async (req, res) => {
    const { keyword } = req.query;
    let videos = []
    if (keyword) {
        videos = await Video.find({
            title: {
                $regex: new RegExp(keyword, "i")
            }
        })
    }
    return res.render("search", {pageTitle: "Search", videos})
}