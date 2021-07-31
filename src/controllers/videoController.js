import Video from "../model/Video";
import User from "../model/User";

export const home = async(req, res) => {
    try {
        const videos =  await Video.find({}).sort({ createdAt : "desc"})
        return res.render("home", {pageTitle : "Home", videos});
    }
    catch {
        return res.render("search-error")
    }
    
} 
export const getEdit = async (req, res) => {
    const { id } = req.params;
    const { user: { _id }} = req.session;
    const video = await Video.findById(id);
    // getEdit에서는 exists를 못쓰고 findById 사용 : video Object가 필요하기 때문
    if (!video) {
        return res.render("404", {pageTitle: "Video is not found"});
    }
    if (String(video.owner) !== String(_id)) {
        req.flash("info", "Not authorized");
        return res.status(403).redirect("/");
    }
    return res.render("edit", {pageTitle: `Editing: ${video.title} `, video})
}
export const postEdit = async (req, res) => {
    const { id } = req.params;
    const { user: { _id }} = req.session;
    const { title, description, hashtags } = req.body;
    const video = await Video.findById(id);
    // exists(filter): video Object를 받는 대신 True or Flase를 return 받음 
    if (!video) {
        return res.status(404).render("404", {pageTitle: "Video is not found"});
    };
    if (String(video.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    };
    await Video.findByIdAndUpdate(id, {
        title, description, hashtags: Video.formatHashtags(hashtags)
    });
    return res.redirect(`/videos/${id}`);
}
export const watch = async (req, res) => {
    const { id } = req.params; // id 는 req.params에서 오는 것 기억하기
    const video = await Video.findById(id).populate('owner');
    if(!video) {
        return res.status(404).render("404", {pageTitle: "Video is not found"});
    }
    return res.render("watch", {pageTitle: video.title, video});
}
export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle : "Upload Video"})
}

export const postUpload = async (req, res) => {
    const { session: { user: { _id }},
            file: { path: fileUrl },
            body: { title, description, hashtags }} = req;
    try{
        const newVideo = await Video.create({
            title, 
            fileUrl,
            description,
            owner: _id,
            hashtags: Video.formatHashtags(hashtags)
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect("/")    
    }
    // await ~.create : 데이터를 만들고 저장까지 함
    catch (error) {
        return res.render("upload", {pageTitle : "Upload Video", errorMessage: error})
    }
    
}

export const deleteVideo = async (req, res) => {
    const { id } = req.params;
    const { user: { _id }} = req.session;
    const video = await Video.findById(id);
    const user = await User.findById(_id);
    if (!video) {
        return res.render("404", {pageTitle: "Video is not found"});
    }
    if (String(video.owner) !== String(_id)) {
        req.flash("info", "Not authorized");
        return res.status(403).redirect("/");
    }
    user.videos.splice(user.videos.indexOf(id), 1);
    user.save();
    await Video.findByIdAndDelete(id);
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

export const registerView = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video) {
        return res.sendStatus(404);
    } 
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
    // res.status만 하면 (pending) 상태
    // sendStatus: status를 보내고 연결 종료
}