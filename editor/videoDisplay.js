import projectState from "./projectState.js";
import { resizeCallbacks } from "./panelSizes.js";
import TextLayer from "./videoLayerPrefabs/text.js";

const videoLayers = [];

const videoDisplay = document.querySelector("#video-display");
const videoDisplayContainer = document.querySelector("#video-display-container");
let videoDisplayContainerRatio = videoDisplayContainer.clientWidth / videoDisplayContainer.clientHeight;
resizeCallbacks.push(() => {
	videoDisplayContainerRatio = videoDisplayContainer.clientWidth / videoDisplayContainer.clientHeight;
	updateVideoDisplayDimensions();
	for (const videoLayer of videoLayers) {
		videoLayer.draw();
	}
});

function updateVideoDisplayDimensions() {
	const videoDisplayRatio = projectState.videoSizeRatio[0] / projectState.videoSizeRatio[1];
	if (videoDisplayContainerRatio > videoDisplayRatio) {
		// pillar box: ||
		console.log("pillar box")
		videoDisplay.style.width = videoDisplayContainer.clientHeight * videoDisplayRatio + "px";
		videoDisplay.style.height = videoDisplayContainer.clientHeight + "px";
	} else {
		// letter box: =
		console.log("letter box");
		videoDisplay.style.width = videoDisplayContainer.clientWidth + "px";
		videoDisplay.style.height = videoDisplayContainer.clientWidth * videoDisplayRatio + "px";
	}
}
updateVideoDisplayDimensions();

export function addVideoLayer(videoLayer) {
	this.videoLayer.push(videoLayer);
	videoLayer.draw();
}
addVideoLayer(new TextLayer(0, 100, "adssud"))