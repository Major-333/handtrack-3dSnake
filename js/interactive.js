const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const dirThreshold = 0.12;

let isVideo = false;
let model = null;
let videoInterval = 100;

let oldGamex = 0;
let oldGamey = 0;


const modelParams = {
    flipHorizontal: true,   // flip e.g for video
    maxNumBoxes: 20,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.6,    // confidence threshold for predictions.
};

function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            isVideo = true;
            runDetection()
        } else {
            alert("Please enable video")
        }
    });
}

function getDirection(gamex, gamey) {
    let diffx = gamex - oldGamex;
    let diffy = gamey - oldGamey;
    console.log("diffx & diffy: ", diffx, diffy);
    oldGamey = gamey;
    oldGamex = gamex;
    if(Math.abs(diffx) > Math.abs(diffy)) {
        if(diffx > dirThreshold){
            return "right"
        }
        else if(diffx < -dirThreshold){
            return "left"
        }
        else {
            return "null"
        }
    }
    else{
        if(diffy > dirThreshold){
            return "bottom"
        }
        else if(diffy < -dirThreshold){
            return "top"
        }
        else {
            return "null"
        }
    }
}

function setSnakeDir(dir) {
    if(dir !== "null"){
        // ws.send(dir)
        // GameStart = true;
        console.log(dir);
        switch(dir){
            case "left":{
                if (snake.direction !== 39){
                    GameStart = true;
                    snake.directionBuffer = 37;

                }
                break;
            }
            case "top":{
                if (snake.direction !== 40){
                    GameStart = true;
                    snake.directionBuffer = 38;
                }
                break;
            }
            case "right":{
                if (snake.direction !== 37){
                    GameStart = true;
                    snake.directionBuffer = 39;

                }
                break;
            }
            case "bottom":{
                if (snake.direction !== 38){
                    GameStart = true;
                    snake.directionBuffer = 40;
                }
                break;
            }
            case "restart": {
                location.reload();
                break;
            }
            default:
                break;
        }


    }
}

function runDetection() {
    model.detect(video).then(predictions => {
        // console.log("Predictions: ", predictions);
        // get the middle x value of the bounding box and map to paddle location
        model.renderPredictions(predictions, canvas, context, video);
        if (predictions[0]) {
            let midvalx = predictions[0].bbox[0] + (predictions[0].bbox[2] / 2);
            let midvaly = predictions[0].bbox[1] + (predictions[0].bbox[3] / 2);
            gamex = midvalx / video.width;
            gamey = midvaly / video.height;
            console.log(gamex, gamey);
            let dir = getDirection(gamex, gamey);
            setSnakeDir(dir)
        }
        if (isVideo) {
            setTimeout(() => {
                runDetection(video)
            }, videoInterval);
        }
    });
}


// Load the model.
handTrack.load(modelParams)
    .then(lmodel => {
        model = lmodel;
        startVideo()
    });


