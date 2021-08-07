import fetch from "node-fetch";

const videoContainer = document.getElementById("videoContainer");
const form  = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const deleteBtn = document.getElementById("deleteBtn");

const addComment = (text, id) => {
    const commentContainer = document.querySelector(".video__comments ul");
    const commentList = document.createElement("li");
    commentList.dataset.id = id;
    commentList.classList.add("video__comment");
    const icon = document.createElement("i");
    const span = document.createElement("span");
    const span2 = document.createElement("span");
    icon.className = "fas fa-comment"
    span.innerText = ` ${text}`;
    span.innerText = "❌";
    commentList.appendChild(icon);
    commentList.appendChild(span);
    commentList.appendChild(span2);
    commentContainer.prepend(commentList);
}


const handleSubmit = async (event) => {
    event.preventDefault();
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    if(text === "") {
        return
    }
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method:"POST",  
        headers: {
            "Content-Type" : "application/json"
        },
        body:  JSON.stringify({ text }),
    })
    if(response.status === 201) {
        const {newCommentId} = await response.json();
        textarea.value="";
        addComment(text, newCommentId);
    }
}

const handleDelete = () => {
    
}

form.addEventListener("submit", handleSubmit);
deleteBtn.addEventListener("click", handleDelete);