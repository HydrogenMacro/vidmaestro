import FrameTime from "../frameTime.js";
import { resizeCallbacks } from "../panelSizes.js";
import projectState from "../projectState.js";
import { parseHTML, } from "../utils.js";

const trackAreaTracks = document.querySelector("#track-area-tracks");
const trackElems = document.getElementsByClassName("track-area-track");

export function updateTracks() {
	console.log(projectState.currentTracks);
	for (let i = 0; i < projectState.currentTracks.length; i++) {
		const trackComponents = projectState.currentTracks[i];
		let trackElem = trackElems.item(i);
		// clears all children of trackElem
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
			trackElem.appendChild(trackComponent.trackDisplayElement);
		}
	}
	updateTrackPositions();
}
export function updateTrackPositions() {
	for (const track of projectState.currentTracks) {
		for (const trackComponent of track) {
			const gapScale =
				projectState.trackScaleUnits[
					projectState.currentTrackScale
				].toSecs() / 8;
			trackComponent.trackDisplayElement.style.left =
				FrameTime.getScaleFactor(
					FrameTime.fromSecs(
						projectState.trackScaleUnits[
							projectState.currentTrackScale
						].toSecs() / 8
					),
					trackComponent.startTime
				) *
					projectState.rulerGradationMarkGap -
				projectState.trackAreaScreenPos +
				"px";
			trackComponent.trackDisplayElement.style.width =
				FrameTime.getScaleFactor(
					FrameTime.fromSecs(
						projectState.trackScaleUnits[
							projectState.currentTrackScale
						].toSecs() / 8
					),
					trackComponent.duration
				) *
					projectState.rulerGradationMarkGap +
				"px";
		}
	}
}
resizeCallbacks.push(updateTrackPositions);
