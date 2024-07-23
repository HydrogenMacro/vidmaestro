const workspace = document.getElementById("workspace");
const projectSettingsModal = document.getElementById("project-settings-modal");
const projectSettingsModalExitBtn = document.getElementById("project-settings-modal-exit-btn");

let isToggled = true;
export function toggleProjectSettingsModal() {
	if (isToggled) {
		workspace.style.filter = "";
		projectSettingsModal.style.display = "none";
		isToggled = false;
	} else {
		workspace.style.filter = "brightness(60%) blur(2px)";
		projectSettingsModal.style.display = "";
		isToggled = true;
	}
}
workspace.addEventListener("click", e => {
	if (!isToggled) return;
	if (!projectSettingsModal.contains(e.target)) {
		toggleProjectSettingsModal();
	}
});
projectSettingsModalExitBtn.addEventListener("click", () => {
	toggleProjectSettingsModal();
});
// toggle it to hide
toggleProjectSettingsModal();
