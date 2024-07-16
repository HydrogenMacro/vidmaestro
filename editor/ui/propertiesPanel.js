import Component from "../components/component.js";
import { removeAllChildren } from "../utils.js";

const propertiesPanel = document.getElementById("properties-panel");
let currentDisplayedComponent = null;
/**
 * 
 * @param {Component} component 
 */
export function showPropertiesOfComponent(component) {
	resetPropertiesPanel();
	currentDisplayedComponent = component;
	for (const descendantAttributes of component.constructor.attributesTree) {
		propertiesPanel.insertAdjacentHTML("beforeend", 
			`<p>${descendantAttributes.name}</p>`
		)
		for (const attribute of descendantAttributes.attributes) {
			switch (attribute.baseType) {
				case "Number":
					const numberInput = document.createElement("input");
					numberInput.addEventListener("change", () => {
						alert(numberInput.value)
					});
					propertiesPanel.insertAdjacentElement("beforeend", numberInput)
					break;
				case "String":
					break;
				case "Bool":
					break;
				case "Component":
					break;
				case "Number":
					break;
			}
		}
	}
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
	removeAllChildren(propertiesPanel)
	currentDisplayedComponent = null;
}