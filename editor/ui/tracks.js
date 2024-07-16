import FrameTime from "../frameTime.js";
import { resizeCallbacks } from "../panelSizes.js";
import projectState from "../projectState.js";
import { removeAllChildren, parseHTML } from "../utils.js";
import { resetPropertiesPanel, showPropertiesOfComponent } from "./propertiesPanel.js";

const trackAreaTracks = document.querySelector("#track-area-tracks");
const trackElems = document.getElementsByClassName("track-area-track");

export function updateTracks() {
	for (let i = 0; i < projectState.currentTracks.length; i++) {
		const trackComponents = projectState.currentTracks[i];
		let trackElem = trackElems.item(i);
		// clears all children of trackElem
		removeAllChildren(trackElem);
		for (const trackComponent of trackComponents) {
			if (!trackComponent.trackDisplayElement) {
				trackComponent.trackDisplayElement = parseHTML(`
					<div class="track-area-track-component"></div>
				`);
				setupComponentDisplayElement(trackComponent);
			}
			trackElem.appendChild(trackComponent.trackDisplayElement);
		}
	}
	updateTrackComponentDisplayElems();
}
export function updateTrackComponentDisplayElems() {
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
resizeCallbacks.push(updateTrackComponentDisplayElems);

function setupComponentDisplayElement(component) {
	component.trackDisplayElement.addEventListener("click", () => {
		if (projectState.selectedVideoComponent === component) {
			unselectComponent();
		} else {
			selectComponent(component);
		}
	});
}
function selectComponent(component) {
	if (projectState.selectedVideoComponent) {
		projectState.selectedVideoComponent.trackDisplayElement.classList.remove(
			"track-area-track-component-selected"
		);
	}

	projectState.selectedVideoComponent = component;
	component.trackDisplayElement.classList.add(
		"track-area-track-component-selected"
	);
	showPropertiesOfComponent(component);
}
function unselectComponent() {
	projectState.selectedVideoComponent.trackDisplayElement.classList.remove(
		"track-area-track-component-selected"
	);
	projectState.selectedVideoComponent = null;
	resetPropertiesPanel();
}
