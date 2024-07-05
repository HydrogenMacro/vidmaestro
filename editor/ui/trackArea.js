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
let trackAreaZoom = 1;
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
let currentScrollIntervalHandle = setInterval(() => {
	scrollTrackAreaBy(trackAreaScrollDir);
}, 200);
// #region scroll listeners
trackAreaScrollUpBtn.addEventListener("pointerdown", () => {
	trackAreaScrollDir = -1;
	resetCurrentScrollInterval();
});
Keybinds.register("ArrowUp", Keybinds.FocusArea.Tracks, () => {
	trackAreaScrollDir = -1;
	resetCurrentScrollInterval();
});
trackAreaScrollDownBtn.addEventListener("pointerdown", () => {
	trackAreaScrollDir = 1;
	resetCurrentScrollInterval();
});
Keybinds.register("ArrowDown", Keybinds.FocusArea.Tracks, () => {
	trackAreaScrollDir = 1;
	resetCurrentScrollInterval();
});
document.body.addEventListener("pointerup", () => {
	trackAreaScrollDir = 0;
	clearInterval(currentScrollIntervalHandle);
});
// #endregion
trackAreaTracks.addEventListener("wheel", (e) => {
	scrollTrackAreaBy(e.deltaY);
});
trackAreaTrackLabels.addEventListener("wheel", (e) => {
	scrollTrackAreaBy(e.deltaY);
});
function resetCurrentScrollInterval() {
	let trackAndMarginHeight = trackAreaTracks.lastChild.clientHeight + 3;
	const scrollCb = () => {
		const rem = trackAreaTracks.scrollTop % trackAndMarginHeight;
		if (rem) {
			trackAreaTracks.scrollTop -=
				trackAreaTracks.scrollTop % trackAndMarginHeight;
		}
		trackAreaTracks.scrollTop += trackAreaScrollDir * trackAndMarginHeight;
		trackAreaTrackLabels.scrollTop = trackAreaTracks.scrollTop;
	};
	currentScrollIntervalHandle = setInterval(scrollCb, 200);
	scrollCb();
}
function scrollTrackAreaBy(delta) {
	trackAreaTracks.scrollTop += delta;
	trackAreaTrackLabels.scrollTop += delta;
}
