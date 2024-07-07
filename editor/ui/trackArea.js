import FrameTime from "../frameTime.js";
import Keybinds from "../keybinds.js";
import { resizeCallbacks } from "../panelSizes.js";
import projectState from "../projectState.js";
import { parseHTML, clamp, lerp, easeOut } from "../utils.js";

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
const trackScaleUnits = [
	new FrameTime(0, 8, 120),
	new FrameTime(0, 40, 120),
	new FrameTime(1, 0, 120),
	new FrameTime(8, 0, 120),
	new FrameTime(32, 0, 120),
	new FrameTime(60, 0, 120),
	new FrameTime(240, 0, 120),
	new FrameTime(1000, 0, 120),
];
let currentTrackScale = 3;
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
function updateTracks() {
	const trackElems = document.getElementsByClassName("track-area-track");
	for (let i = 0; i < projectState.currentTracks.length; i++) {
		const track = trackAreaTracks.children.item(i);
		const trackComponents = projectState.currentTracks[i];
		let trackElem = trackElems.item(i);
		// clears all children of trackElem
		console.log(projectState.currentTracks)
		while (trackElem.lastElementChild) {
			trackElem.removeChild(trackElem.lastElementChild);
		}
		for (const trackComponent of trackComponents) {
			if (!trackComponent.trackDisplayElement) {
				trackComponent.trackDisplayElement = parseHTML(`
					<div class="track-area-track-component">
						<div class="track-area-track-component-left-handle">
						</div>
						<div class="track-area-track-component-body-handle">
						</div>
						<div class="track-area-track-component-right-handle">
						</div>
					</div>
				`);
			}
			trackElem.style.left =
				projectState.trackAreaScreenPos *
					FrameTime.getScaleFactor(
						trackComponent.startTime,
						trackScaleUnits[currentTrackScale]
					) +
				"px";

			trackElem.appendChild(trackComponent.trackDisplayElement);
		}
	}
}
updateTracks();

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
					trackScaleUnits[currentTrackScale],
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
});
trackAreaTracks.addEventListener("wheel", (e) => {
	let scrollDelta = e.deltaX / 4;
	if (!scrollDelta) scrollDelta = -e.deltaY / 4;
	scrollTrackAreaHorizonatallyBy(scrollDelta);
});
function scrollTrackAreaHorizonatallyBy(delta) {
	projectState.trackAreaScreenPos = Math.max(
		projectState.trackAreaScreenPos + delta,
		0
	);
	updateTrackRuler();
}
