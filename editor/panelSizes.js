const verticalSeparator = document.querySelector("#vertical-separator");
const horizontalSeparator = document.querySelector("#horizontal-separator");
const videoDisplayContainer = document.querySelector("#video-display-container");
const workspaceLeft = document.querySelector("#workspace-left");
const header = document.querySelector("header");
let separatorBeingAdjusted = null;
verticalSeparator.addEventListener("pointerdown", () => {
	separatorBeingAdjusted = verticalSeparator;
});
horizontalSeparator.addEventListener("pointerdown", () => {
	separatorBeingAdjusted = horizontalSeparator;
});
document.body.addEventListener("pointerup", () => {
	separatorBeingAdjusted = null;
});
export const resizeCallbacks = [];
document.body.addEventListener("pointermove", e => {
	switch (separatorBeingAdjusted) {
		case null:
			return;
		case verticalSeparator:
			if (window.innerWidth - e.clientX < 20) {
				workspaceLeft.style.width = window.innerWidth + "px";
			} else if (e.clientX < 20) {
				workspaceLeft.style.width = "0px";
			} else {
				workspaceLeft.style.width = e.clientX + "px";
			}
			break;
		case horizontalSeparator:
			const headerHeight = header.clientHeight;
			let targetPos = e.clientY - headerHeight;
			if (window.innerHeight - e.clientY < 20) {
				videoDisplayContainer.style.height = (workspaceLeft.clientHeight - horizontalSeparator.clientHeight) + "px";
			} else if (targetPos < 20) {
				videoDisplayContainer.style.height = "0px";
			} else {
				videoDisplayContainer.style.height = targetPos + "px";
			}
			break;
	}
	for (const cb of resizeCallbacks) {
		cb();
	}
});
