import projectState from "./projectState.js";

const Keybinds = {
	FocusArea: Object.freeze({
		Video: "video",
		Tracks: "tracks",
		PropertiesPanel: "propertiesPanel",
		All: "all"
	}),
	registry: new Map(), // String -> {}
	register(key, focusArea, cb) {
		if (!this.registry.has(key)) {
			this.registry.set(key, {
				video: null,
				tracks: null,
				propertiesPanel: null,
				all: null
			});
		}
		this.registry.get(key)[focusArea] = cb;
	},
	registerWithModifiers(keyInfo) {
		const { key, ctrl, alt, shift } = keyInfo;
		this.register(transformKey(key, ctrl, alt, shift));
	},
};
document.addEventListener("keydown", (e) => {
	Keybinds
		.registry
		.get(transformKey(e.key, e.ctrlKey, e.altKey, e.shiftKey))
		[projectState.focusArea]
		?.();
	Keybinds.registry.get(transformKey(e.key, e.ctrlKey, e.altKey, e.shiftKey)).all?.();
});
function transformKey(key, ctrl, alt, shift) {
	if (ctrl || alt || shift) key += "_";
	if (ctrl) key += "C";
	if (alt) key += "A";
	if (shift) key += "S";
	return key;
}

document
	.getElementById("video-display-container")
	.addEventListener("click", () => {
		projectState.focusArea = "video";
	});
document.getElementById("workspace-bottom").addEventListener("click", () => {
	projectState.focusArea = "tracks";
});
document.getElementById("properties-panel").addEventListener("click", () => {
	projectState.focusArea = "propertiesPanel";
});
export default Keybinds;
