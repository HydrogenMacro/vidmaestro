const workspaceSeparator = document.querySelector("#workspace-separator");
const videoTracksSeparator = document.querySelector("#video-tracks-separator");
const videoDisplay = document.querySelector("#video-display");
const workspaceLeft = document.querySelector("#workspace-left");
const header = document.querySelector("header");
let separatorBeingAdjusted = null;
workspaceSeparator.addEventListener("pointerdown", () => {
	separatorBeingAdjusted = workspaceSeparator;
});
videoTracksSeparator.addEventListener("pointerdown", () => {
	separatorBeingAdjusted = videoTracksSeparator;
});
document.body.addEventListener("pointerup", () => {
	separatorBeingAdjusted = null;
});

document.body.addEventListener("pointermove", e => {
	switch (separatorBeingAdjusted) {
		case null:
			return;
		case workspaceSeparator:
			if (window.innerWidth - e.clientX < 10) {
				workspaceLeft.style.width = window.innerWidth + "px";
			} else if (e.clientX < 10) {
				workspaceLeft.style.width = "0px";
			} else {
				workspaceLeft.style.width = e.clientX + "px";
			}
			break;
		case videoTracksSeparator:
			const headerHeight = header.clientHeight;
			let targetPos = e.clientY - headerHeight;
			if (window.innerHeight - e.clientY < 10) {
				videoDisplay.style.height = (window.innerHeight - headerHeight - videoTracksSeparator.clientHeight) + "px";
			} else if (targetPos < 10) {
				videoDisplay.style.height = "0px";
			} else {
				videoDisplay.style.height = targetPos + "px";
			}
			break;
	}
});