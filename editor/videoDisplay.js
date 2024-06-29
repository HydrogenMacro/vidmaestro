import projectState from "./projectState.js";
import { resizeCallbacks } from "./panelSizes.js";
import TextLayer from "./videoLayerPrefabs/text.js";

const videoLayers = [];

const videoDisplay = document.querySelector("#video-display");
const videoDisplayContainer = document.querySelector("#video-display-container");
const videoDebugDisplay = document.querySelector("#video-debug-display");
let videoDisplayContainerRatio = videoDisplayContainer.clientWidth / videoDisplayContainer.clientHeight;
resizeCallbacks.push(() => {
	videoDisplayContainerRatio = videoDisplayContainer.clientWidth / videoDisplayContainer.clientHeight;
	updateVideoDisplayDimensions();
	for (const videoLayer of videoLayers) {
		videoLayer.display();
	}
	updateVideoDebugDisplay();
});

function updateVideoDisplayDimensions() {
	const videoDisplayRatio = projectState.videoSizeRatio[0] / projectState.videoSizeRatio[1];
	if (videoDisplayContainerRatio > videoDisplayRatio) {
		// pillar box: ||
		videoDisplay.style.width = videoDisplayContainer.clientHeight * videoDisplayRatio + "px";
		videoDisplay.style.height = videoDisplayContainer.clientHeight + "px";
	} else {
		// letter box: =
		videoDisplay.style.width = videoDisplayContainer.clientWidth + "px";
		videoDisplay.style.height = videoDisplayContainer.clientWidth * videoDisplayRatio + "px";
	}
}
updateVideoDisplayDimensions();

export function addVideoLayer(videoLayer) {
	videoDisplay.appendChild(videoLayer.canvas);
	videoLayers.push(videoLayer);
	videoLayer.display();
}

const videoDebugDisplayCtx = videoDebugDisplay.getContext("2d");
function updateVideoDebugDisplay() {
	if (projectState.selectedVideoLayer) {
		videoDebugDisplay.width = videoDisplay.clientWidth;
		videoDebugDisplay.height = videoDisplay.clientHeight;
		videoDebugDisplayCtx.strokeStyle = "green"
		const [x, y, w, h] = projectState.selectedVideoLayer.getBoundingBox();
		videoDebugDisplayCtx.strokeRect(x, y, w, h);
	}
}

const textLayer = new TextLayer(0, 100);
textLayer.translation = [100, 74];
setInterval(() => { textLayer.rotation += .05; textLayer.display(); updateVideoDebugDisplay() }, 100)
addVideoLayer(textLayer);
projectState.selectedVideoLayer = textLayer;

updateVideoDebugDisplay()