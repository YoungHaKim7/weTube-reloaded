import fetch from "node-fetch";

const videoContainer = document.getElementById("videoContainer");
const form  = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const deleteBtn = document.querySelectorAll(".deleteBtn");

const addComment = (text, id, commentArr) => {
    const commentContainer = document.querySelector(".video__comments ul");
    const commentList = document.createElement("li");
    commentList.dataset.id = id;
    commentList.classList.add("video__comment");
    const icon = document.createElement("i");
    const span = document.createElement("span");
    const span2 = document.createElement("span");
    icon.className = "fas fa-comment";
    span.innerText = ` ${text}`;
    span2.classList.add("deleteBtn");
    span2.innerText = "❌";
    commentList.appendChild(icon);
    commentList.appendChild(span);
    commentList.appendChild(span2);
    commentContainer.prepend(commentList);
    span2.addEventListener("click", handleDelete)
}

const deleteComment = (event) => {
    const commentList = event.target.parentElement;
    commentList.remove();
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
        body: JSON.stringify({ text }),
    });
    if(response.status === 201) {
        const {newCommentId, userComments} = await response.json();
        textarea.value="";
        addComment(text, newCommentId,userComments);  
    }
}

const handleDelete = async (event) => {
    const commentList = document.querySelector(".video__comment");
    const commentId = commentList.dataset.id;
    const videoId = videoContainer.dataset.id;
    const response = await fetch(`/api/comments/${commentId}/delete`, {
        method: "DELETE",
        headers: {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            videoId,
        })
    });
    if(response.status === 201) {
        deleteComment(event);
    }
}


form.addEventListener("submit", handleSubmit);  
for (let i = 0; i< deleteBtn.length; i++) {
    deleteBtn[i].addEventListener("click", handleDelete);
}