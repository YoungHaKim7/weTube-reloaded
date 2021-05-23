let videos = [
    {
        title: "First Video",
        rating: 5,
        Comments : 2, 
        creadedAt : "2 min ago", 
        views : 1,
        id : 1
    },
    {
        title: "Second Video",
        rating: 5,
        Comments : 2, 
        creadedAt : "2 min ago", 
        views : 12,
        id : 2
    },
    {
        title: "Third Video",
        rating: 5,
        Comments : 2, 
        creadedAt : "2 min ago", 
        views : 12,
        id : 3
    }
    
];

export const trending = (req, res) => {
    
    return res.render("home", {pageTitle : "Home", title : "Hello", videos});
} 
export const getEdit = (req, res) => {
    const { id } = req.params; //ES6 version / it's same "const id = req.params.id;"
    const video = videos[id - 1];
    return res.render("edit", {pageTitle: `Editing: ${video.title}`, video})
}
export const postEdit = (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    videos[id - 1].title = title;
    return res.redirect(`/videos/${id}`)
}
export const watch = (req, res) => {
    const { id } = req.params;
    const video = videos[id - 1];
    return res.render("watch", {pageTitle: `Watching ${video.title}`, video});
}
export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle : "Upload Video"})
}

export const postUpload = (req, res) => {
    const { title } = req.body;
    const newVideo = {
        title,
        rating: 0,
        Comments : 0, 
        creadedAt : "just now", 
        views : 0,
        id : videos.length+1
    };
    videos.push(newVideo);
    return res.redirect("/")
}