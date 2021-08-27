import fetch from "node-fetch";

const video = document.querySelector("video")
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumn = document.getElementById("volumn");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenBtnIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoplayer = document.getElementById("videoplayer");
const videoController = document.getElementById("videoController");

let timeoutControll = null;
let controlsMovementTimeout = null;
let volumnValue = 0.5;
video.volume = volumnValue;

const videoPlay = () => {
    if (video.paused) { 
        video.play();
    } else {
        video.pause();
    }
}
const videoPlayBtn = () => {
    playBtnIcon.classList = video.paused ? "fas fa-play fa-lg" : "fas fa-pause fa-lg";
}

const formatTime = (seconds) => {
    return new Date(seconds*1000).toISOString().substr(14, 5)
}

const handlePlayClick = (e) => {
    videoPlay();
    videoPlayBtn();
}

const handleMute = (e) => {
    if (video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtnIcon.classList = video.muted ? "fas fa-volume-mute fa-lg" : "fas fa-volume-up fa-lg";
    volumeRange.value = video.muted ? 0 : volumnValue;
}
const handleVolumeChange = (event) => {
    const { 
        target: { value }
    } = event;
    if(video.muted) {
        video.muted = false;
        video.volume = value;
        muteBtnIcon.classList = "fas fa-volume-mute fa-lg";
    }
    // #11.3 localStorage추가 
    muteBtnIcon.classList = parseFloat(value) === 0 ? "fas fa-volume-mute fa-lg" : "fas fa-volume-up fa-lg";
    volumnValue = value; // 전역변수라서 모든 코드에서 기억
    video.volume = value;
}
const handleLoadmetadata = () => {
    timeline.max = Math.floor(video.duration);
    totalTime.innerText = formatTime(Math.floor(video.duration));
}
const handleTimeUpdate = () => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
}
const handleTimeLineChange = (event) => {
    const { 
        target: { value }
    } = event;
    video.currentTime = value;
};
const handleFullScreen = () => {
    const fullScreen = document.fullscreenElement;
    if (!fullScreen) {
        video.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
    fullScreenBtnIcon.classList = fullScreen ? "fas fa-expand fa-lg" : "fas fa-compress fa-lg";
};

const hideControl = () =>  videoController.classList.remove("showing");
const handleMouseMove = () => {
    if (timeoutControll) {
        clearTimeout(timeoutControll);
        timeoutControll = null;
    }
    if(controlsMovementTimeout) {
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoController.classList.add("showing");
    controlsMovementTimeout = setTimeout(hideControl, 3000);
};
const handleMouseLeave = () => {
    timeoutControll = setTimeout(hideControl, 3000)
}
const handleVideoClick = () => {
    videoPlay();
    videoPlayBtn();

}
const logKey = (event) => {
    if (event.code === "Space") {
        videoPlay();
        videoPlayBtn();
    }
    if (event.code === "Escape") {
        if (document.fullscreenElement) {
        video.exitFullscreen();
        }
    }
}
const handleVideoEnded = () => {
    const { id } = videoContainer.dataset;
    fetch(`/api/videos/${id}/view`, { method: "POST"}); 
    // api 요청하는 법 : fetch
}

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange); // input: 클릭하고 움직일때
video.addEventListener("loadedmetadata", handleLoadmetadata);
video.addEventListener("timeupdate", handleTimeUpdate); // timeupdate: 비디오 시청 시 시간변경때
timeline.addEventListener("input", handleTimeLineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
video.addEventListener("click", handleVideoClick);
document.addEventListener('keydown', logKey);
video.addEventListener("ended", handleVideoEnded);
