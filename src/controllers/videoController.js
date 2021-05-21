const fakeUser = {
    userName: "Lee",
    loggedIn: true
}

let videos = [
    {
        title: "First Video",
        rating: 5,
        Comments : 2, 
        creadedAt : "2 min ago", 
        views : 12,
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
    
    return res.render("home", {pageTitle : "Home", title : "Hello", fakeUser, videos});
} 
export const watch = (req, res) => res.render("watch", {pageTitle : "Watch"});
export const edit = (req, res) => res.send("Edit video");
export const see = (req, res) => {
    const { id } = req.params; //ES6 version / it's same "const id = req.params.id;"
    const video = videos[id - 1];
    return res.render("watch", {pageTitle: `Watching ${video.title}`});
}

export const upload = (req, res) => {
    return res.send("Upload");
}