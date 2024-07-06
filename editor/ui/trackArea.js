import FrameTime from "../frameTime.js";
import Keybinds from "../keybinds.js";
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
const componentToHTMLElementStore = new WeakMap(); // component -> weakref<htmlelement>
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
function updateTrackComponents() {
	for (let i = 0; i < projectState.currentTracks.length; i++) {
		const track = trackAreaTracks.children.item(i);
		const trackComponents = projectState.currentTracks[i];
	}
}

export function addComponentToTrack(component, trackIndex) {
	const componentTrackDisplayElement = parseHTML(`
		<div class="track-area-track-component">
			<div class="track-area-track-component-left-handle">
			</div>
			<div class="track-area-track-component-body-handle">
			</div>
			<div class="track-area-track-component-right-handle">
			</div>
		</div>
	`);
	componentToHTMLElementStore.set(
		component,
		new WeakRef(componentTrackDisplayElement)
	);
	projectState.currentTracks[trackIndex].push(component);
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
	scrollTrackAreaBy(-8);
});
trackAreaScrollDownBtn.addEventListener("pointerdown", () => {
	trackAreaScrollDir = 30;
	resetCurrentScrollInterval();
});
Keybinds.register("ArrowDown", Keybinds.FocusArea.Tracks, () => {
	scrollTrackAreaBy(8);
});
document.body.addEventListener("pointerup", () => {
	trackAreaScrollDir = -15;
	clearInterval(currentScrollIntervalHandle);
});
trackAreaTracks.addEventListener("wheel", (e) => {
	scrollTrackAreaBy(e.deltaY / 10);
});
trackAreaTrackLabels.addEventListener("wheel", (e) => {
	scrollTrackAreaBy(e.deltaY / 10);
});
function resetCurrentScrollInterval() {
	currentScrollIntervalHandle = setInterval(scrollTrackAreaBy.bind(this, trackAreaScrollDir), 50);
	scrollTrackAreaBy(trackAreaScrollDir);
}
function scrollTrackAreaBy(delta) {
	trackAreaTracks.scrollTop += delta;
	trackAreaTrackLabels.scrollTop += delta;
}
// #endregion

const trackScaleUnits = [
	new FrameTime(0, 4, 120),
	new FrameTime(0, 30, 120),
	new FrameTime(1, 0, 120),
	new FrameTime(5, 0, 120),
	new FrameTime(20, 0, 120),
	new FrameTime(60, 0, 120),
	new FrameTime(240, 0, 120),
	new FrameTime(960, 0, 120),
];