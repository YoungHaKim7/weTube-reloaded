import fetch from "node-fetch";

const videoContainer = document.getElementById("videoContainer");
const form  = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const cancleBtn = form.querySelector("#cancleBtn");
const commentBtn = form.querySelector("#commentBtn");
const deleteBtn = document.querySelectorAll(".deleteBtn");

commentBtn.disabled=true;

const commentDisabled = () => {
    commentBtn.disabled = true;
    commentBtn.style.backgroundColor = "rgb(236, 236, 236)";
    commentBtn.style.color = "rgba(0, 0, 0, 0.5)";
    commentBtn.style.cursor = "";
}

const addComment = (text, id) => {
    const commentContainer = document.querySelector(".video__comments ul");
    const commentList = document.createElement("li");
    const div = document.createElement("div");
    commentList.dataset.id = id;
    commentList.classList.add("video__comment");
    const icon = document.createElement("i");
    const icon2 = document.createElement("i");
    const span = document.createElement("span");
    const span2 = document.createElement("span");
    icon.className = "fas fa-comment";
    icon2.className = "far fa-trash-alt";
    span.innerText = ` ${text}`;
    span2.classList.add("deleteBtn");
    div.appendChild(icon);
    div.appendChild(span);
    span2.appendChild(icon2);
    commentList.appendChild(div);
    commentList.appendChild(span2);
    commentContainer.prepend(commentList);
    span2.addEventListener("click", handleDelete)
}

const deleteComment = (event) => {
    const commentContainer = document.querySelector(".video__comments ul");
    const commentList = event.target.parentNode.parentNode;
    commentContainer.removeChild(commentList);    
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
        const {newCommentId} = await response.json();
        textarea.value="";
        addComment(text, newCommentId);  
    } 
    
}

const handleDelete = async (event) => {
    const commentList = event.target.parentNode.parentNode;
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
    if(response.status === 403) {
        alert("댓글 주인이 아닙니다.");
    }
}

const handleInput = () => {
    commentBtn.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    commentBtn.style.color = "rgb(255, 255, 255)";
    commentBtn.style.cursor = "pointer"
    commentBtn.disabled = false;
    if(textarea.value === "") {
        commentDisabled();
    }
}

const handleCancle = () => {
    textarea.value="";
    commentDisabled();
}

textarea.addEventListener("input", handleInput);
form.addEventListener("submit", handleSubmit);  
cancleBtn.addEventListener("click", handleCancle);
for (let i = 0; i< deleteBtn.length; i++) {
    deleteBtn[i].addEventListener("click", handleDelete);
}