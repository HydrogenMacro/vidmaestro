import FrameTime from "../frameTime.js";
import { resizeCallbacks } from "../panelSizes.js";
import projectState from "../projectState.js";
import { generateVideo } from "../videoExport.js";
import { toggleProjectSettingsModal } from "./projectSettings.js";
import {
	createNewTrack,
	removeTrack,
	updateCaret,
	updateTrackLength,
	updateTrackRuler,
} from "./trackArea.js";
import { updateTrackComponentDisplayElems, updateTracks } from "./tracks.js";
import {
	deleteComponent,
	drawComponents,
	updateVideoDebugDisplay,
} from "./videoDisplay.js";
const header = document.querySelector("header");

let headerActiveDropdown = null;
for (const headerBtn of document.getElementsByClassName("header-btn")) {
	headerBtn.addEventListener("click", (e) => {
		const dropdown = document.getElementById(
			`header-${headerBtn.dataset.dropdown}-dropdown`
		);
		dropdown.style.left = headerBtn.offsetLeft + "px";
		if (headerActiveDropdown !== dropdown) {
			headerActiveDropdown = dropdown;
		} else {
			headerActiveDropdown = null;
		}
		updateHeaderDropdowns();
	});
}
document.body.addEventListener("click", (e) => {
	if (header.contains(e.target)) return;
	headerActiveDropdown = null;
	updateHeaderDropdowns();
});
function updateHeaderDropdowns() {
	for (const dropdown of document.getElementsByClassName("header-dropdown")) {
		dropdown.style.display =
			headerActiveDropdown === dropdown ? "" : "none";
	}
}
resizeCallbacks.push(updateHeaderDropdowns);
updateHeaderDropdowns();

const headerDropdownOptionActions = {
	new: () => {
		location.reload();
	},
	export: async () => {
		console.log("downloading");
		let videoUrl = await generateVideo();
		console.log("downloaded");
		const downloaderElem = document.createElement("a");
		downloaderElem.download = "video.webm";
		downloaderElem.href = videoUrl;
		downloaderElem.click();
		URL.revokeObjectURL(videoUrl);
	},
	delete: () => {
		if (projectState.selectedVideoComponent) {
			deleteComponent(projectState.selectedVideoComponent);
			updateTracks();
			updateTrackComponentDisplayElems();
			drawComponents();
			resetPropertiesPanel();
		}
	},
	"scroll-to-start": () => {
		projectState.trackAreaScreenPos = 0;
		updateTrackComponentDisplayElems();
		updateTrackRuler();
		updateCaret();
	},
	"scroll-to-cursor": () => {
		projectState.trackAreaScreenPos =
			(projectState.videoSeekPos.toSecs() /
				projectState.trackScaleUnits[
					projectState.currentTrackScale
				].toSecs()) *
			projectState.rulerGradationMarkGap *
			8;
		updateTrackComponentDisplayElems();
		updateTrackRuler();
		updateCaret();
	},
	"scroll-to-end": () => {
		updateTrackLength();
		projectState.trackAreaScreenPos =
			(projectState.currentVideoLength.toSecs() /
				projectState.trackScaleUnits[
					projectState.currentTrackScale
				].toSecs()) *
			projectState.rulerGradationMarkGap *
			8;
		updateTrackComponentDisplayElems();
		updateTrackRuler();
		updateCaret();
	},
	"project-settings": () => {
		toggleProjectSettingsModal();
	},
};
for (const headerDropdownOption of document.getElementsByClassName(
	"header-dropdown-option"
)) {
	headerDropdownOption.addEventListener("click", () => {
		headerDropdownOptionActions[headerDropdownOption.dataset.action]();
	});
}
