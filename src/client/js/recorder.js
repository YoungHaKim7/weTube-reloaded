const startBtn = document.getElementById("startBtn");
const span = startBtn.querySelector("span");
const icon = startBtn.querySelector("i");
const video = document.getElementById("preview");

let recorder;
let stream;
let videoFile;

const handleDownload = () => {
    const a = document.createElement("a");
    a.href = videoFile;
    a.download = "MyRecording.webm";
    document.body.appendChild(a);
    a.click();

}

const handleStop = () => {
    span.innerText = "Download video"; 
    icon.className = "fas fa-download fa-lg";
    startBtn.removeEventListener("click", handleStop);
    startBtn.addEventListener("click", handleDownload);
    recorder.stop();
}

const handleStart = () => {
    span.innerText = "Stop";
    icon.className = "fas fa-stop fa-lg";
    startBtn.removeEventListener("click", handleStart);
    startBtn.addEventListener("click", handleStop);
    recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    recorder.ondataavailable = (event) => {
        videoFile = URL.createObjectURL(event.data);
        video.srcObject = null;
        video.src = videoFile;
        video.loop = true;
        video.play();
    }
    recorder.start();
}

const init = async () => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
    });
    video.srcObject = stream;
    video.play();
}

init();

startBtn.addEventListener("click", handleStart);


