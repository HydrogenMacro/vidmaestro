import VideoComponent from "../components/video.js";
import FrameTime from "../frameTime.js";
import projectState from "../projectState.js";
import { updateTracks } from "./tracks.js";
import { addComponents } from "./videoDisplay.js";
const addComponentsBtn = document.getElementById(
	"video-control-add-component-btn"
);
const addComponentOptionsElem = document.getElementById(
	"video-control-add-component-btn-options"
);
const addComponentOptionVideoElem = document.getElementById(
	"video-control-add-component-btn-option-video"
);
const addComponentOptionTextElem = document.getElementById(
	"video-control-add-component-btn-option-text"
);
const addComponentOptionShapeElem = document.getElementById(
	"video-control-add-component-btn-option-shape"
);
const seekPosInput = document.querySelector("#video-control-seek-pos");
seekPosInput.addEventListener("click", () => {
	seekPosInput.select();
})
seekPosInput.addEventListener("change", () => {
	seekPosInput.blur();
	projectState.videoSeekPos =
		FrameTime.fromString(seekPosInput.value) ??
		projectState.videoSeekPos;
	updateSeekPosInput();
});

function updateSeekPosInput() {
	seekPosInput.value = projectState.videoSeekPos.toFormattedString();
	seekPosInput.style.fontSize = Math.max(1 / Math.sqrt(seekPosInput.value.length * .3), .5) + "rem"
}
updateSeekPosInput();

let addComponentOptionsVisible = false;
addComponentOptionsElem.style.display = "none";
export function updateAddComponentOptions() {
	addComponentOptionsElem.style.top = addComponentsBtn.offsetTop + "px";
	addComponentOptionsElem.style.left =
		addComponentsBtn.offsetLeft + addComponentsBtn.offsetWidth + "px";
	if (addComponentOptionsVisible) {
		addComponentOptionsElem.style.display = "";
		addComponentsBtn.classList.add("video-control-btn-active");
	} else {
		addComponentOptionsElem.style.display = "none";
		addComponentsBtn.classList.remove("video-control-btn-active");
	}
}
updateAddComponentOptions();
addComponentsBtn.addEventListener("click", event => {
	addComponentOptionsVisible = !addComponentOptionsVisible;
	updateAddComponentOptions();
	event.stopPropagation();
})
document.documentElement.addEventListener("click", e => {
	addComponentOptionsVisible = false;
	updateAddComponentOptions();
})
addComponentOptionVideoElem.addEventListener("click", () => {
	const a = new VideoComponent();
	addComponents(a);
});