import FrameTime from "../frameTime.js";
import Keybinds from "../keybinds.js";
import { resizeCallbacks } from "../panelSizes.js";
import projectState from "../projectState.js";
import { parseHTML, clamp, lerp, easeOut } from "../utils.js";
import { updateTrackComponentDisplayElems, updateTracks } from "./tracks.js";
import { updateAddComponentOptions } from "./videoControls.js";
import { drawComponents } from "./videoDisplay.js";

const trackArea = document.querySelector("#track-area");
const trackAreaRuler = document.querySelector("#track-area-ruler");
const trackAreaTrackLabels = document.querySelector("#track-area-track-labels");
const trackAreaTracks = document.querySelector("#track-area-tracks");
const trackAreaAddBtn = document.querySelector("#track-area-add-track-btn");
const trackAreaCaret = document.querySelector("#track-area-caret");

const trackAreaScrollUpBtn = document.querySelector(
	"#track-area-scroll-up-btn"
);
const trackAreaScrollDownBtn = document.querySelector(
	"#track-area-scroll-down-btn"
);
const trackElems = document.getElementsByClassName("track-area-track");

export function updateTrackLength() {
	projectState.currentVideoLength = FrameTime.zero();
	for (const track of projectState.currentTracks) {
		for (const component of track) {
			if (
				component.startTime.toSecs() + component.duration.toSecs() >
				projectState.currentVideoLength.toSecs()
			) {
				projectState.currentVideoLength = FrameTime.add(
					component.startTime,
					component.duration
				);
			}
		}
	}
}
updateTrackLength();

export function createNewTrack() {
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
	return projectState.currentTracks[projectState.currentTracks.length - 1];
}
trackAreaAddBtn.addEventListener("click", createNewTrack);
let trackAreaScrollDir = 0;
let currentScrollIntervalHandle = null;
// #region scroll listeners
trackAreaScrollUpBtn.addEventListener("pointerdown", () => {
	trackAreaScrollDir = -15;
	resetCurrentScrollInterval();
});
let verticalArrowKeyScrollIntervalHandle = null;
Keybinds.register(
	"ArrowUp",
	Keybinds.FocusArea.Tracks,
	() => {
		verticalArrowKeyScrollIntervalHandle = setInterval(() => {
			scrollTrackAreaVerticallyBy(-16);
		}, 50);
	},
	() => clearInterval(verticalArrowKeyScrollIntervalHandle)
);
Keybinds.register(
	"ArrowDown",
	Keybinds.FocusArea.Tracks,
	() => {
		verticalArrowKeyScrollIntervalHandle = setInterval(() => {
			scrollTrackAreaVerticallyBy(16);
		}, 50);
	},
	() => clearInterval(verticalArrowKeyScrollIntervalHandle)
);
trackAreaScrollDownBtn.addEventListener("pointerdown", () => {
	trackAreaScrollDir = 30;
	resetCurrentScrollInterval();
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
	updateCaret();
}
resizeCallbacks.push(updateTrackRuler);
updateTrackRuler();

trackAreaRuler.addEventListener("wheel", (e) => {
	let scrollDelta = e.deltaX / 4;
	if (!scrollDelta) scrollDelta = -e.deltaY / 4;
	scrollTrackAreaHorizonatallyBy(scrollDelta);
	updateTrackComponentDisplayElems();
});
trackAreaTracks.addEventListener("wheel", (e) => {
	let scrollDelta = e.deltaX / 4;
	if (!scrollDelta) scrollDelta = -e.deltaY / 4;
	scrollTrackAreaHorizonatallyBy(scrollDelta);
	updateTrackComponentDisplayElems();
});
function scrollTrackAreaHorizonatallyBy(delta) {
	projectState.trackAreaScreenPos = Math.max(
		projectState.trackAreaScreenPos + delta,
		0
	);
	updateTrackRuler();
}
Keybinds.register("-", Keybinds.FocusArea.Tracks, () => {
	let prevTrackScale =
		projectState.trackScaleUnits[projectState.currentTrackScale];
	projectState.currentTrackScale = Math.min(
		projectState.currentTrackScale + 1,
		projectState.trackScaleUnits.length - 1
	);
	projectState.trackAreaScreenPos *=
		prevTrackScale.toSecs() /
		projectState.trackScaleUnits[projectState.currentTrackScale].toSecs();
	updateTrackRuler();
	updateTrackComponentDisplayElems();
});
Keybinds.register("=", Keybinds.FocusArea.Tracks, () => {
	let prevTrackScale =
		projectState.trackScaleUnits[projectState.currentTrackScale];
	projectState.currentTrackScale = Math.max(
		projectState.currentTrackScale - 1,
		0
	);
	projectState.trackAreaScreenPos *=
		prevTrackScale.toSecs() /
		projectState.trackScaleUnits[projectState.currentTrackScale].toSecs();
	updateTrackRuler();
	updateTrackComponentDisplayElems();
});

export function updateCaret() {
	trackAreaCaret.style.left =
		FrameTime.getScaleFactor(
			FrameTime.fromSecs(
				projectState.trackScaleUnits[
					projectState.currentTrackScale
				].toSecs() / 8
			),
			projectState.videoSeekPos
		) *
			projectState.rulerGradationMarkGap -
		projectState.trackAreaScreenPos +
		"px";
	drawComponents();
}
updateCaret();
let caretBeingAdjusted = false;
let caretScrollTolerance = 15;

let caretAutoScrollDir = 0;
trackAreaCaret.addEventListener("pointerdown", (e) => {
	caretBeingAdjusted = true;
});
document.body.addEventListener("pointermove", (e) => {
	if (!caretBeingAdjusted) return;
	let caretRelativePos = e.pageX - trackAreaTracks.offsetLeft;
	if (caretRelativePos < caretScrollTolerance) {
		if (projectState.trackAreaScreenPos < caretScrollTolerance) {
			// clamp to 0 instead
			if (caretRelativePos < 0) {
				trackAreaCaret.style.left = "0px";
			} else {
				trackAreaCaret.style.left = caretRelativePos + "px";
			}
			caretAutoScrollDir = 0;
		} else {
			trackAreaCaret.style.left = caretScrollTolerance + "px";
			caretAutoScrollDir = -1;
		}
	} else if (
		caretRelativePos >
		trackAreaTracks.offsetWidth - caretScrollTolerance
	) {
		trackAreaCaret.style.left =
			trackAreaTracks.offsetWidth - caretScrollTolerance + "px";
		caretAutoScrollDir = 1;
	} else {
		trackAreaCaret.style.left = caretRelativePos + "px";
		caretAutoScrollDir = 0;
	}

	let px = trackAreaCaret.offsetLeft + projectState.trackAreaScreenPos;
	let oneSecInPx =
		(projectState.rulerGradationMarkGap * 8) /
		projectState.trackScaleUnits[projectState.currentTrackScale].toSecs();
	projectState.videoSeekPos = FrameTime.fromSecs(px / oneSecInPx);
	updateTrackRuler();
	drawComponents();
	updateCaret();
});
setInterval(() => {
	if (caretAutoScrollDir === 0) return;
	let oneSecInPx =
		(projectState.rulerGradationMarkGap * 8) /
		projectState.trackScaleUnits[projectState.currentTrackScale].toSecs();
	let caretScrollToleranceFT = FrameTime.fromSecs(
		caretScrollTolerance / oneSecInPx
	);
	const applyDelta =
		caretAutoScrollDir === 1 ? FrameTime.add : FrameTime.clampedSubtract;
	projectState.videoSeekPos = applyDelta(
		projectState.videoSeekPos,
		caretScrollToleranceFT
	);
	projectState.trackAreaScreenPos = Math.max(
		projectState.trackAreaScreenPos +
			caretAutoScrollDir * caretScrollTolerance,
		0
	);
	updateCaret();
	updateTrackComponentDisplayElems();
	updateTrackRuler();
}, 50);
document.body.addEventListener("pointerup", () => {
	caretBeingAdjusted = false;
	caretAutoScrollDir = 0;
});
window.addEventListener("blur", () => {
	caretBeingAdjusted = false;
	caretAutoScrollDir = 0;
});
document.body.addEventListener("pointercancel", () => {
	caretBeingAdjusted = false;
	caretAutoScrollDir = 0;
});
