import projectState from "../projectState.js";
import { parseHTML } from "../utils.js";

const trackArea = document.querySelector("#track-area");
const trackAreaRuler = document.querySelector("#track-area-ruler");
const trackAreaTrackLabels = document.querySelector("#track-area-track-labels");
const trackAreaTracks = document.querySelector("#track-area-tracks");

let trackAreaZoom = 1;
const componentToHTMLElementStore = new WeakMap(); // component -> weakref<htmlelement>
export function updateTrackLength() {
	let currentLength = 0;
	for (const track of projectState.currentTracks) {
		for (const component of track) {
			currentLength = Math.max(currentLength, component.startTime + component.duration);
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
	componentToHTMLElementStore.set(component, new WeakRef(componentTrackDisplayElement));
	projectState.currentTracks[trackIndex].push(component);
}
function createNewTrack() {
	projectState.currentTracks.push([]);
	// todo: create corresponding element
}