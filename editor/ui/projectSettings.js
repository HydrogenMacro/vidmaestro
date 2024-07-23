import { resizeCallbacks } from "../panelSizes.js";
import projectState from "../projectState.js";
import { updateTrackRuler } from "./trackArea.js";
import { updateSeekPosInput } from "./videoControls.js";
import { drawComponents } from "./videoDisplay.js";

const workspace = document.getElementById("workspace");
const projectSettingsModal = document.getElementById("project-settings-modal");
const projectSettingsModalExitBtn = document.getElementById(
	"project-settings-modal-exit-btn"
);
const projectSettingsModalFpsInput = document.getElementById(
	"project-settings-modal-fps"
);
const projectSettingsModalVideoWidthInput = document.getElementById(
	"project-settings-modal-video-width"
);
const projectSettingsModalVideoHeightInput = document.getElementById(
	"project-settings-modal-video-height"
);

let isToggled = true;
export function toggleProjectSettingsModal() {
	projectSettingsModalFpsInput.value = projectState.fps;
	projectSettingsModalVideoWidthInput.value = projectState.videoSize[0];
	projectSettingsModalVideoHeightInput.value = projectState.videoSize[1];
	if (isToggled) {
		workspace.style.filter = "";
		projectSettingsModal.style.display = "none";
		isToggled = false;
	} else {
		workspace.style.filter = "brightness(60%) blur(2px)";
		projectSettingsModal.style.display = "";
		isToggled = true;
	}
}
workspace.addEventListener("click", (e) => {
	if (!isToggled) return;
	if (!projectSettingsModal.contains(e.target)) {
		toggleProjectSettingsModal();
	}
});
projectSettingsModalFpsInput.addEventListener("change", () => {
	let newFps = +projectSettingsModalFpsInput.value;
	if (newFps % 4 !== 0) {
		alert("FPS must be a multiple of 4");
		projectSettingsModalFpsInput.value = projectState.fps;
		return;
	}
	if (newFps < 4 || newFps > 120 || isNaN(newFps)) {
		alert("FPS must be in the range 4-120");
		projectSettingsModalFpsInput.value = projectState.fps;
		return;
	}
	projectState.fps = newFps;
	updateSeekPosInput();
	updateTrackRuler();
});
projectSettingsModalVideoWidthInput.addEventListener("change", () => {
	let newVideoWidth = +projectSettingsModalVideoWidthInput.value;
	if (newVideoWidth < 1 || isNaN(newVideoWidth)) {
		alert("Video width must be greater than 0");
		projectSettingsModalVideoWidthInput.value = projectState.videoSize[0];
		return;
	}
	projectState.videoSize[0] = newVideoWidth;
	resizeCallbacks.forEach((cb) => cb());
});
projectSettingsModalVideoHeightInput.addEventListener("change", () => {
	let newVideoHeight = +projectSettingsModalVideoHeightInput.value;
	if (newVideoHeight < 1 || isNaN(newVideoHeight)) {
		alert("Video height must be greater than 0");
		projectSettingsModalVideoHeightInput.value = projectState.videoSize[1];
		return;
	}
	projectState.videoSize[1] = newVideoHeight;
	resizeCallbacks.forEach((cb) => cb());
});
projectSettingsModalFpsInput.addEventListener("click", (e) =>
	e.target.select()
);
projectSettingsModalVideoWidthInput.addEventListener("click", (e) =>
	e.target.select()
);
projectSettingsModalVideoHeightInput.addEventListener("click", (e) =>
	e.target.select()
);
projectSettingsModalExitBtn.addEventListener("click", () => {
	toggleProjectSettingsModal();
});
// toggle it to hide
toggleProjectSettingsModal();
