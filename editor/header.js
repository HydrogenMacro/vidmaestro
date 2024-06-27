import { showFilePicker } from "./utils.js"
const headerMap = {
	__proto__: null,
	File: {
		Import: importFile,
	},
	Edit: {

	},
	View: {

	},
	Options: {

	}
}
function importFile() {
	showFilePicker()
}
const currentPath = [];
const currentHeaderBtns = [];
const header = document.querySelector("header");
function update() {
	currentHeaderBtns.length = 0;
	for (const headerBtnID of Object.keys(traverse(headerMap, currentPath))) {
		let headerBtn = document.createElement("div");
		headerBtn.textContent = headerBtnID;
		headerBtn.onclick = () => {
			currentPath.push(headerBtnID);
			let next = traverse(headerMap, currentPath);
			if (next instanceof Function) {
				next();
				currentPath.pop();
			} else {
				update();
			}
		};
		currentHeaderBtns.push(headerBtn)
	}
	header.replaceChildren(...currentHeaderBtns);
}
function traverse(objTree, path) {
	for (const pathSeg of path) {
		objTree = objTree[pathSeg];
	}
	return objTree;
}
update();