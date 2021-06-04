import Video from "../model/Video";

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
*/

export const home = async(req, res) => {
    try {
        const videos =  await Video.find({});
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
    if (!video) {
        return res.render("404", {pageTitle: "Video is not found"});
    }
    return res.render("edit", {pageTitle: `Editing: ${video.title} `, video})
}
export const postEdit = async (req, res) => {
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.exists({ _id:id});
    if (!video) {
        return res.render("404", {pageTitle: "Video is not found"});
    }
    await Video.findByIdAndUpdate(id, {
        title, description, hashtags:hashtags.split(",").map(word => (word.startsWith("#") ? word : `#${word}`))
    })
    await video.save();
    return res.redirect(`/videos/${id}`);
}
export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video) {
        return res.render("404", {pageTitle: "Video is not found"});
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
            hashtags,
        });
        return res.redirect("/")    
    }
    catch (error) {
        return res.render("upload", {pageTitle : "Upload Video", errorMessage: error})
    }
    
}