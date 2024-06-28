import { updateVideoDisplaySize } from "./videoDisplay.js";

const panelGroups = Array.from(document.getElementsByClassName("panel-group"));
const panelGroupWidths = [
	window.innerWidth / 3,
	window.innerWidth / 3,
	window.innerWidth / 3
];
let isAdjusting = false;
let adjustmentState = {
	borderToBeAdjusted: 0,
	originalPointerPos: 0,
	originalLeftwardPanelWidth: 0,
	originalRightwardPanelWidth: 0
};
let editor = document.querySelector("#editor");
let header = document.querySelector("header");
let borderSelectTolerance = 5;
let minEditorWidth = window.innerWidth / 5;
const pointerStatus = {
	down: false,
	up: false,
	posX: 0,
	posY: 0
};
let currentWindowWidth = window.innerWidth;
editor.addEventListener("pointermove", e => {
	pointerStatus.posX = e.clientX;
	pointerStatus.posY = e.clientY;
	update()
});
editor.addEventListener("pointerdown", e => {
	pointerStatus.down = true;
	pointerStatus.posX = e.clientX;
	pointerStatus.posY = e.clientY;
	update()
})
let pointerUpCb = e => {
	pointerStatus.up = true;
	pointerStatus.posX = e.clientX;
	pointerStatus.posY = e.clientY;
	update()
	document.body.style.cursor = "default";
};
editor.addEventListener("pointerup", pointerUpCb);
editor.addEventListener("pointercancel", pointerUpCb);
function update() {
	panelGroups.forEach((panelGroup, i) => {
		panelGroup.style.width = panelGroupWidths[i] + "px";
	});
	let isBetweenPanels = [
		Math.abs(panelGroupWidths[0] - pointerStatus.posX) < borderSelectTolerance,
		Math.abs(panelGroupWidths[0] + panelGroupWidths[1] - pointerStatus.posX) < borderSelectTolerance,
	];
	if ((pointerStatus.posY > header.clientHeight && (isBetweenPanels[0] || isBetweenPanels[1])) || isAdjusting) {
		document.body.style.cursor = "col-resize";
	} else {
		document.body.style.cursor = "default";
	}
	if (pointerStatus.down) {
		pointerStatus.down = false;
		isAdjusting = false;
		for (let i = 0; i <= 1; i++) {
			if (isBetweenPanels[i]) {
				// user wants to adjust panel sizes
				isAdjusting = true;
				adjustmentState.borderToBeAdjusted = i;
				adjustmentState.originalPointerPos = pointerStatus.posX;
				adjustmentState.originalLeftwardPanelWidth = panelGroupWidths[i];
				adjustmentState.originalRightwardPanelWidth = panelGroupWidths[i + 1];
			}
		}
	}
	if (pointerStatus.up) {
		pointerStatus.up = false;
		isAdjusting = false;
	}
	if (isAdjusting) {
		let adjustmentDifference = pointerStatus.posX - adjustmentState.originalPointerPos;
		// leftward panel
		panelGroupWidths[adjustmentState.borderToBeAdjusted] = adjustmentState.originalLeftwardPanelWidth + adjustmentDifference;
		// rightward panel
		panelGroupWidths[adjustmentState.borderToBeAdjusted + 1] = adjustmentState.originalRightwardPanelWidth - adjustmentDifference;
		if (panelGroupWidths[adjustmentState.borderToBeAdjusted] < minEditorWidth) {
			panelGroupWidths[adjustmentState.borderToBeAdjusted + 1] -= minEditorWidth - panelGroupWidths[adjustmentState.borderToBeAdjusted];
			panelGroupWidths[adjustmentState.borderToBeAdjusted] = minEditorWidth;
		}
		if (panelGroupWidths[adjustmentState.borderToBeAdjusted + 1] < minEditorWidth) {
			panelGroupWidths[adjustmentState.borderToBeAdjusted] -= minEditorWidth - panelGroupWidths[adjustmentState.borderToBeAdjusted + 1];
			panelGroupWidths[adjustmentState.borderToBeAdjusted + 1] = minEditorWidth;
		}
	}
	updateVideoDisplaySize();
}
update()
window.addEventListener("resize", () => {
	minEditorWidth = window.innerWidth / 5;
	let windowWidthChange = window.innerWidth - currentWindowWidth;
	currentWindowWidth = window.innerWidth;
	for (let i = 0; i < 3; i++) {
		panelGroupWidths[i] += windowWidthChange / 3
	}
	console.log(currentWindowWidth)
	respectMinPanelGroupSize();
	update();
})
function respectMinPanelGroupSize() {
	for (let i = 0; i < 3; i++) {
		if (panelGroupWidths[i] < minEditorWidth) {
			panelGroupWidths[i + 1] -= minEditorWidth - panelGroupWidths[i];
			panelGroupWidths[i] = minEditorWidth;
		}
		if (panelGroupWidths[i + 1] < minEditorWidth) {
			panelGroupWidths[i] -= minEditorWidth - panelGroupWidths[i + 1];
			panelGroupWidths[i + 1] = minEditorWidth;
		}
	}
}