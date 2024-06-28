import { pointerStatus } from "./panelGroups.js";
const videoDisplay = document.querySelector("#video-display");
const videoDisplayContainer = document.querySelector("#video-display-container");
const trackPanel = document.querySelector("#track-panel");
let videoDisplayContainerRatio = videoDisplayContainer.clientWidth / videoDisplay.clientHeight;
let videoDisplayRatio = 1 / 1;
let trackPanelSize = 100;
function updateTrackPanelSize() {

}
export function updateVideoDisplaySize() {
	videoDisplayContainerRatio = videoDisplayContainer.clientWidth / videoDisplayContainer.clientHeight;
	console.log(videoDisplayContainer.clientWidth, videoDisplayContainer.clientHeight)
	if (videoDisplayContainerRatio > videoDisplayRatio) {
		// container wider than video display, pillar box
		videoDisplay.style.maxWidth = videoDisplay.style.minWidth = "auto";
		videoDisplay.style.maxHeight = videoDisplay.style.minHeight = videoDisplayContainer.clientHeight + "px";
		console.log("pbox")
	} else {
		videoDisplay.style.maxHeight = videoDisplay.style.minHeight = "auto";
		videoDisplay.style.maxWidth = videoDisplay.style.minWidth = videoDisplayContainer.clientWidth + "px";
		console.log("lbox")
	}
}
updateVideoDisplaySize();