import Component from "../components/component.js";
import FrameTime from "../frameTime.js";
import { removeAllChildren } from "../utils.js";
import { updateTrackComponentDisplayElems } from "./tracks.js";
import { drawComponents, updateVideoDebugDisplay } from "./videoDisplay.js";

const propertiesPanel = document.getElementById("properties-panel");
let currentDisplayedComponent = null;
/**
 *
 * @param {Component} component
n  */
export function showPropertiesOfComponent(component) {
	resetPropertiesPanel();
	currentDisplayedComponent = component;
	for (const descendantAttributes of component.constructor.attributesTree) {
		propertiesPanel.insertAdjacentHTML(
			"beforeend",
			`<p>${descendantAttributes.name}</p>`
		);
		for (const attribute of descendantAttributes.attributes) {
			createAttributeLabel(attribute.alias);
			switch (attribute.baseType) {
				case "Number":
					if (attribute.isArray) {
						createAttributeInput(
							"number",
							component[attribute.field][0] ?? 0,
							(e) => {
								component[attribute.field][0] =
									+e.target.value ??
									component[attribute.field][0];
							}
						);
						createAttributeInput(
							"number",
							component[attribute.field][1] ?? 0,
							(e) => {
								component[attribute.field][1] =
									+e.target.value ??
									component[attribute.field][1];
							}
						);
					} else {
						createAttributeInput(
							"number",
							component[attribute.field] ?? 0,
							(e) => {
								component[attribute.field] =
									+e.target.value ??
									component[attribute.field];
							}
						);
					}
					break;
				case "String":
					createAttributeInput(
						"text",
						component[attribute.field] ?? "",
						(e) => {
							component[attribute.field] = e.target.value;
						}
					);
					break;
				case "Bool":
					createAttributeInput(
						"checkbox",
						component[attribute.field] ?? false,
						(e) => {
							component[attribute.field] = e.target.value;
						}
					);
					break;
				case "Component":
					break;
				case "Color":
					createAttributeInput("color", "#000000", (e) => {
						component[attribute.field] = e.target.value;
					});
					break;
				case "FrameTime":
					createAttributeInput(
						"text",
						component[attribute.field].toFormattedString() ??
							FrameTime.zero().toFormattedString(),
						(e) => {
							let parsedFrameTime = FrameTime.fromString(
								e.target.value
							);
							component[attribute.field] =
								parsedFrameTime ?? component[attribute.field];
							e.target.value = (
								parsedFrameTime ?? component[attribute.field]
							).toFormattedString();
						}
					);
					break;
				case "Video":
					createAttributeInput(
						"file",
						null,
						(e) => {
							let file = e.target.files[0];
							if (!file.type.startsWith("video/")) return;
							const reader = new FileReader();
							reader.onload = () => {
								if (!(component[attribute.field] instanceof HTMLVideoElement)) {
									component[attribute.field] = document.createElement("video");
								}
								component[attribute.field].src = reader.result;
							};
							reader.readAsDataURL(file);
						}
					);
					break;
			}
		}
	}
}
function createAttributeLabel(attributeAlias) {
	propertiesPanel.insertAdjacentHTML("beforeend", `<p>${attributeAlias}</p>`);
}
function createAttributeInput(inputType, defaultValue, inputCb) {
	const attributeInput = document.createElement("input");
	attributeInput.type = inputType;
	attributeInput.addEventListener("click", () => {
		attributeInput.select();
	});
	attributeInput.value = defaultValue;
	attributeInput.addEventListener("change", (e) => {
		inputCb(e);
		updateUI();
	});
	propertiesPanel.insertAdjacentElement("beforeend", attributeInput);
}
function updateUI() {
	drawComponents();
	updateTrackComponentDisplayElems();
	updateVideoDebugDisplay();
}
/*
"Display Name"(fieldName): Number[~100]@100~<abc, def, ghi>{boolean,key=value},
{
			field: "def",
			alias: "abc",
			baseType: "Number",
			isArray: true,
			arrayLengthRange: ["-3", "42"],
			valueRange: ["-2", "7"],
			labels: ["abc", "def", "ghi"],
			tags: { info: "a", multiline: true, abc: "defg" },
		},
*/
export function resetPropertiesPanel() {
	removeAllChildren(propertiesPanel);
	currentDisplayedComponent = null;
}
