const panelGroups = Array.from(document.getElementsByClassName("panel-group"));
const panelGroupWidths = [
	window.innerWidth / 3,
	window.innerWidth / 3,
	window.innerWidth / 3
];
let isAdjusting = false;
let editor = document.querySelector("#editor");
let borderSelectTolerance = 5;
const pointerStatus = {
	down: false,
	move: false,
	up: false,
	posX: 0,
	posY: 0
};
editor.addEventListener("pointermove", e => {
	pointerStatus.move = true;
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
	console.log(isBetweenPanels);
	if (isBetweenPanels[0] || isBetweenPanels[1]) {
		document.body.style.cursor = "col-resize";
	} else {
		document.body.style.cursor = "default";
	}
	if (pointerStatus.down) {
		isAdjusting = false;
		if (isBetweenPanels[0]) {
			// 5 pixels away from border between left and middle panels
			isAdjusting = true;
		}
		console.log(isAdjusting);
	}
}