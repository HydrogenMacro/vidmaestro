import VideoComponent from "../components/video.js";
import FrameTime from "../frameTime.js";
import projectState from "../projectState.js";
import { updateCaret, updateTrackLength } from "./trackArea.js";
import { updateTrackComponentDisplayElems, updateTracks } from "./tracks.js";
import { addComponents, drawComponents } from "./videoDisplay.js";
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
const videoSeekToStartBtn = document.getElementById(
	"video-control-seek-to-start-btn"
);
const videoSeekBackwardBtn = document.getElementById(
	"video-control-seek-backward-btn"
);
const videoSeekForwardBtn = document.getElementById(
	"video-control-seek-forward-btn"
);
const videoSeekToEndBtn = document.getElementById(
	"video-control-seek-to-end-btn"
);
const videoPlayButton = document.getElementById(
	"video-control-play-btn"
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


videoSeekToStartBtn.addEventListener("click", () => {
	projectState.videoSeekPos = FrameTime.zero();
	updateCaret();
});
videoSeekBackwardBtn.addEventListener("click", () => {
	let delta = FrameTime.fromSecs(
		projectState.trackScaleUnits[projectState.currentTrackScale].toSecs() /
			-32
	);
	if (-delta.toSecs() > projectState.videoSeekPos.toSecs()) {
		projectState.videoSeekPos = FrameTime.zero();
		return;
	}
	projectState.videoSeekPos = FrameTime.add(
		projectState.videoSeekPos,
		delta
	);
	updateCaret();
});
videoSeekForwardBtn.addEventListener("click", () => {
	let delta = FrameTime.fromSecs(
		projectState.trackScaleUnits[projectState.currentTrackScale].toSecs() /
		32
	);
	if (delta.toSecs() === 0) {
		delta = FrameTime.fromFrames(1, projectState.fps);
	}
	projectState.videoSeekPos = FrameTime.add(
		projectState.videoSeekPos,
		delta
	);
	updateCaret();
});
videoSeekToEndBtn.addEventListener("click", () => {
	updateTrackLength();
	projectState.videoSeekPos = projectState.currentVideoLength;
	updateCaret();
});

let playVideoIntervalHandle = null;
videoPlayButton.addEventListener("click", () => {
	if (playVideoIntervalHandle) {
		// is already playing, so pause
		clearInterval(playVideoIntervalHandle);
		playVideoIntervalHandle = null;
	} else {
		playVideoIntervalHandle = setInterval(
			() => {
				projectState.videoSeekPos = FrameTime.add(projectState.videoSeekPos, FrameTime.fromFrames(1, projectState.fps));
				updateCaret();
				updateTrackComponentDisplayElems();
				drawComponents();
			},
			1 / projectState.fps
		)
	}
})