import Component from "../components/component.js";
import { removeAllChildren } from "../utils.js";

const propertiesPanel = document.getElementById("properties-panel");
let currentDisplayedComponent = null;
/**
 * 
 * @param {Component} component 
 */
export function showPropertiesOfComponent(component) {
	currentDisplayedComponent = component;
	for (const parentAttribute of component.constructor.attributesTree) {
		console.log(parentAttribute);
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