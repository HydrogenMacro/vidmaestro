import Component from "../components/component.js";
import FrameTime from "../frameTime.js";
import { removeAllChildren } from "../utils.js";
import { updateTrackComponentDisplayElems } from "./tracks.js";

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
					createAttributeInput(
						"text",
						attribute,
						component[attribute.field] ?? 0,
						(e) => {
							component[attribute.field] =
								+e.target.value ?? component[attribute.field];
						}
					);
					break;
				case "String":
					createAttributeInput(
						"text",
						attribute,
						component[attribute.field] ?? "",
						(e) => {
							component[attribute.field] = e.target.value;
						}
					);
					break;
				case "Bool":
					createAttributeInput(
						"checkbox",
						attribute,
						component[attribute.field] ?? false,
						(e) => {
							component[attribute.field] = e.target.value;
						}
					);
					break;
				case "Component":
					break;
				case "Color":
					break;
				case "FrameTime":
					createAttributeInput(
						"text",
						attribute,
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
			}
		}
	}
}
function createAttributeLabel(attributeAlias) {
	propertiesPanel.insertAdjacentHTML("beforeend", `<p>${attributeAlias}</p>`);
}
function createAttributeInput(inputType, attribute, defaultValue, inputCb) {
	const attributeInput = document.createElement("input");
	attributeInput.type = inputType;
	if (attributeInput.type === "text") {
		attributeInput.addEventListener("click", () => {
			attributeInput.select();
		});
	}
	attributeInput.value = defaultValue;
	attributeInput.addEventListener("change", (e) => {
		inputCb(e);
		updateUI();
	});
	propertiesPanel.insertAdjacentElement("beforeend", attributeInput);
}
function updateUI() {
	updateTrackComponentDisplayElems();
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
