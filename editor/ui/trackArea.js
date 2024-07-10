import FrameTime from "../frameTime.js";
import Keybinds from "../keybinds.js";
import { resizeCallbacks } from "../panelSizes.js";
import projectState from "../projectState.js";
import { parseHTML, clamp, lerp, easeOut } from "../utils.js";
import { updateTrackPositions } from "./tracks.js";

const trackArea = document.querySelector("#track-area");
const trackAreaRuler = document.querySelector("#track-area-ruler");
const trackAreaTrackLabels = document.querySelector("#track-area-track-labels");
const trackAreaTracks = document.querySelector("#track-area-tracks");
const trackAreaAddBtn = document.querySelector("#track-area-add-track-btn");
const trackAreaScrollUpBtn = document.querySelector(
	"#track-area-scroll-up-btn"
);
const trackAreaScrollDownBtn = document.querySelector(
	"#track-area-scroll-down-btn"
);
const trackElems = document.getElementsByClassName("track-area-track");

export function updateTrackLength() {
	let currentLength = 0;
	for (const track of projectState.currentTracks) {
		for (const component of track) {
			currentLength = Math.max(
				currentLength,
				component.startTime + component.duration
			);
		}
	}
	projectState.currentLength = currentLength;
}

function createNewTrack() {
	projectState.currentTracks.push([]);
	trackAreaTrackLabels.insertAdjacentHTML(
		"beforeend",
		`<div class="track-area-track-label">${
			trackAreaTrackLabels.children.length + 1
		}</div>`
	);
	trackAreaTracks.insertAdjacentHTML(
		"beforeend",
		`<div class="track-area-track"></div>`
	);
	trackAreaTrackLabels.scrollTop = trackAreaTrackLabels.scrollHeight;
	trackAreaTracks.scrollTop = trackAreaTracks.scrollHeight;
}
trackAreaAddBtn.addEventListener("click", createNewTrack);
let trackAreaScrollDir = 0;
let currentScrollIntervalHandle = null;
// #region scroll listeners
trackAreaScrollUpBtn.addEventListener("pointerdown", () => {
	trackAreaScrollDir = -15;
	resetCurrentScrollInterval();
});
Keybinds.register("ArrowUp", Keybinds.FocusArea.Tracks, () => {
	scrollTrackAreaVerticallyBy(-8);
});
trackAreaScrollDownBtn.addEventListener("pointerdown", () => {
	trackAreaScrollDir = 30;
	resetCurrentScrollInterval();
});
Keybinds.register("ArrowDown", Keybinds.FocusArea.Tracks, () => {
	scrollTrackAreaVerticallyBy(8);
});
document.body.addEventListener("pointerup", () => {
	trackAreaScrollDir = -15;
	clearInterval(currentScrollIntervalHandle);
});
trackAreaTrackLabels.addEventListener("wheel", (e) => {
	scrollTrackAreaVerticallyBy(e.deltaY / 6);
});
function resetCurrentScrollInterval() {
	currentScrollIntervalHandle = setInterval(
		scrollTrackAreaVerticallyBy.bind(this, trackAreaScrollDir),
		50
	);
	scrollTrackAreaVerticallyBy(trackAreaScrollDir);
}
function scrollTrackAreaVerticallyBy(delta) {
	trackAreaTracks.scrollTop += delta;
	trackAreaTrackLabels.scrollTop += delta;
}
// #endregion

const trackAreaRulerCtx = trackAreaRuler.getContext("2d");
function resizeTrackRuler() {
	trackAreaRulerCtx.canvas.width =
		trackAreaRulerCtx.canvas.clientWidth * window.devicePixelRatio;
	trackAreaRulerCtx.canvas.height =
		trackAreaRulerCtx.canvas.clientHeight * window.devicePixelRatio;
	trackAreaRulerCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
}
resizeCallbacks.push(resizeTrackRuler);
resizeTrackRuler();
function updateTrackRuler() {
	let rulerWidth = trackAreaRulerCtx.canvas.clientWidth;
	let rulerHeight = trackAreaRulerCtx.canvas.clientHeight;
	trackAreaRulerCtx.clearRect(0, 0, rulerWidth, rulerHeight);
	trackAreaRulerCtx.font = "10px Inter";
	for (
		let gradationMarkNum =
			Math.floor(
				projectState.trackAreaScreenPos /
					projectState.rulerGradationMarkGap
			) - 1;
		gradationMarkNum <
		Math.floor(
			projectState.trackAreaScreenPos / projectState.rulerGradationMarkGap
		) +
			rulerWidth / projectState.rulerGradationMarkGap +
			1;
		gradationMarkNum += 1
	) {
		let pos =
			gradationMarkNum * projectState.rulerGradationMarkGap -
			projectState.trackAreaScreenPos;
		let gradationMarkHeight;
		if (gradationMarkNum % 8 === 0) {
			gradationMarkHeight = rulerHeight * 0.4;
			trackAreaRulerCtx.fillStyle = "#000";
			trackAreaRulerCtx.fillText(
				FrameTime.multiply(
					projectState.trackScaleUnits[
						projectState.currentTrackScale
					],
					Math.max(gradationMarkNum, 0) / 8
				).toFormattedString(),
				pos,
				10
			);
			trackAreaRulerCtx.fillRect(
				pos,
				rulerHeight - gradationMarkHeight,
				2,
				gradationMarkHeight
			);
		} else if (gradationMarkNum % 2 === 1) {
			gradationMarkHeight = rulerHeight * 0.2;
		} else if (gradationMarkNum % 4 === 0) {
			gradationMarkHeight = rulerHeight * 0.3;
		} else {
			gradationMarkHeight = rulerHeight * 0.4;
		}
		trackAreaRulerCtx.fillStyle = "#444";
		trackAreaRulerCtx.fillRect(
			pos,
			rulerHeight - gradationMarkHeight,
			1,
			gradationMarkHeight
		);
	}
}
resizeCallbacks.push(updateTrackRuler);
updateTrackRuler();

trackAreaRuler.addEventListener("wheel", (e) => {
	let scrollDelta = e.deltaX / 4;
	if (!scrollDelta) scrollDelta = -e.deltaY / 4;
	scrollTrackAreaHorizonatallyBy(scrollDelta);
	updateTrackPositions();
});
trackAreaTracks.addEventListener("wheel", (e) => {
	let scrollDelta = e.deltaX / 4;
	if (!scrollDelta) scrollDelta = -e.deltaY / 4;
	scrollTrackAreaHorizonatallyBy(scrollDelta);
	updateTrackPositions();
});
function scrollTrackAreaHorizonatallyBy(delta) {
	projectState.trackAreaScreenPos = Math.max(
		projectState.trackAreaScreenPos + delta,
		0
	);
	updateTrackRuler();
}
Keybinds.register("-", Keybinds.FocusArea.Tracks, () => {
	console.log("a");
	projectState.currentTrackScale = Math.min(
		projectState.currentTrackScale + 1,
		projectState.trackScaleUnits.length - 1
	);
	projectState.trackAreaScreenPos /= 2;
	updateTrackRuler();
	updateTrackPositions();
});
Keybinds.register("=", Keybinds.FocusArea.Tracks, () => {
	console.log("b");
	projectState.currentTrackScale = Math.max(
		projectState.currentTrackScale - 1,
		0
	);
	projectState.trackAreaScreenPos *= 2;
	updateTrackRuler();
	updateTrackPositions();
});
