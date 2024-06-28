const videoDisplay = document.querySelector("#video-display");
const videoDisplayContainer = document.querySelector("#video-display-container");
let videoDisplayContainerRatio = videoDisplayContainer.clientWidth / videoDisplay.clientHeight;
let videoDisplayRatio = 1 / 1;

export function updateVideoDisplaySize() {
	videoDisplayContainerRatio = videoDisplayContainer.clientWidth / videoDisplayContainer.clientHeight;
	if (videoDisplayContainerRatio > videoDisplayRatio) {
		// container wider than video display, pillar box
		videoDisplay.style.height = "100%";
		videoDisplay.style.width = "auto";
	} else {
		videoDisplay.style.width = "100%";
		videoDisplay.style.height = "auto";
	}
}