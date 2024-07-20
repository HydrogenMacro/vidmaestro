import { resizeCallbacks } from "../panelSizes.js";
import { generateVideo } from "../videoExport.js";
const header = document.querySelector("header");

let headerActiveDropdown = null;
for (const headerBtn of document.getElementsByClassName("header-btn")) {
	headerBtn.addEventListener("click", e => {
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
})
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

	},
	save: () => {

	},
	export: async () => {
		console.log("downloading")
		let videoUrl = await generateVideo();
		console.log("downloaded");
		const downloaderElem = document.createElement("a");
		downloaderElem.download = "video.webm";
		downloaderElem.href = videoUrl
		downloaderElem.click();
		URL.revokeObjectURL(videoUrl);
	}
}
for (const headerDropdownOption of document.getElementsByClassName("header-dropdown-option")) {
	headerDropdownOption.addEventListener("click", () => {
		headerDropdownOptionActions[headerDropdownOption.dataset.action]();
	});
}
