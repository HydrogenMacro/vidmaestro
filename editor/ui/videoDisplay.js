import projectState from "../projectState.js";
import { resizeCallbacks } from "../panelSizes.js";
import TextComponent from "../components/text.js";
import PolygonComponent from "../components/geometry.js";

const components = [];

const videoDisplay = document.querySelector("#video-display");
const videoDisplayContainer = document.querySelector("#video-display-container");
const videoDebugDisplay = document.querySelector("#video-debug-display");
let videoDisplayContainerRatio = videoDisplayContainer.clientWidth / videoDisplayContainer.clientHeight;
resizeCallbacks.push(() => {
	videoDisplayContainerRatio = videoDisplayContainer.clientWidth / videoDisplayContainer.clientHeight;
	updateVideoDisplayDimensions();
	for (const component of components) {
		component.display();
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

export function addComponent(component) {
	videoDisplay.appendChild(component.canvas);
	components.push(component);
	component.display();
}

const videoDebugDisplayCtx = videoDebugDisplay.getContext("2d");
function updateVideoDebugDisplay() {
	if (projectState.selectedVideoComponent) {
		videoDebugDisplay.width = videoDisplay.clientWidth;
		videoDebugDisplay.height = videoDisplay.clientHeight;
		videoDebugDisplayCtx.strokeStyle = "green"
		const [x, y, w, h] = projectState.selectedVideoComponent.getBoundingBox();
		videoDebugDisplayCtx.strokeRect(x, y, w, h);
	}
}

const polyComponent = new TextComponent();
polyComponent.translation = [69, 42];
/*
setInterval(() => {
	polyComponent.rotation += .1;
	polyComponent.display();
	updateVideoDebugDisplay()
}, 100); 
*/
addComponent(polyComponent);
projectState.selectedVideoComponent = polyComponent;
updateVideoDebugDisplay()