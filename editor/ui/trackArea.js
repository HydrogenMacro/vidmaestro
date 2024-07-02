import projectState from "../projectState.js";

const trackArea = document.querySelector("#track-area");
const trackAreaZoomInput = document.querySelector("#track-area-zoom-input");
const trackAreaRuler = document.querySelector("#track-area-ruler");
const trackAreaTrackLabels = document.querySelector("#track-area-track-labels");
const trackAreaTracks = document.querySelector("#track-area-tracks");
trackAreaZoomInput.addEventListener("click", () => {
	trackAreaZoomInput.select();
});
trackAreaZoomInput.addEventListener("input", () => {
	if (isNaN(+trackAreaZoomInput.value)) return;
	projectState.trackAreaZoom = +trackAreaZoomInput.value;
});
trackAreaZoomInput.addEventListener("change", () => {
	trackAreaZoomInput.blur();
});