import projectState from "./projectState.js";

const Keybinds = {
	FocusArea: Object.freeze({
		Video: "video",
		Tracks: "tracks",
		PropertiesPanel: "propertiesPanel",
		All: "all",
	}),
	_keyMods: new Map(), // tracks keydown modifiers
	registry: new Map(), // String -> {}
	register(key, focusArea, cb, endCb = null) {
		if (!this.registry.has(key)) {
			this.registry.set(key, {
				video: null,
				tracks: null,
				propertiesPanel: null,
				all: null,
			});
		}
		this.registry.get(key)[focusArea] = [
			cb,
			endCb,
		];
	},
	registerWithModifiers(keyInfo, focusArea, cb, endCb = null) {
		const { key, ctrl, alt, shift } = keyInfo;
		this.register(
			transformKey(key, ctrl, alt, shift),
			focusArea,
			cb,
			endCb
		);
	},
};
document.addEventListener("keydown", (e) => {
	let keyWithMods = transformKey(e.key, e.ctrlKey, e.altKey, e.shiftKey);
	if (!Keybinds.registry.has(keyWithMods)) {
		return;
	}
	Keybinds._keyMods.set(e.key, keyWithMods);
	Keybinds.registry.get(keyWithMods)[projectState.focusArea][0]?.(e);
	Keybinds.registry.get(keyWithMods).all?.[0]?.(e);
});
document.addEventListener("keyup", (e) => {
	let keyWithMods = Keybinds._keyMods.get(e.key);
	if (!keyWithMods) {
		return;
	}
	Keybinds.registry.get(keyWithMods)[projectState.focusArea][1]?.(e);
	Keybinds.registry.get(keyWithMods).all?.[1]?.(e);
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
	.addEventListener("pointerenter", () => {
		projectState.focusArea = "video";
	});
document
	.getElementById("workspace-bottom")
	.addEventListener("pointerenter", () => {
		projectState.focusArea = "tracks";
	});
document
	.getElementById("properties-panel")
	.addEventListener("pointerenter", () => {
		projectState.focusArea = "propertiesPanel";
	});
export default Keybinds;
