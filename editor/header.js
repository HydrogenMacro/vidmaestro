import { showFilePicker } from "./utils.js"
const headerMap = {
	File: {
		Import: importFile,
		Export: () => {}
	},
	Edit: {

	},
	View: {

	},
	Options: {
		"General": {

		},
		"Editor Settings": {

		},
		"Project Settings": {

		}
	}
}
const currentPath = [];
const currentHeaderBtns = [];
const headerListings = document.querySelector("#header-listings");
const headerBreadcrumbs = document.querySelector("#header-breadcrumbs");
function update() {
	currentHeaderBtns.length = 0;
	if (currentPath.length > 0) {
		let backBtn = document.createElement("div");
		backBtn.textContent = "Back";
		backBtn.onclick = () => {
			currentPath.pop();
			update();
		}
		currentHeaderBtns.push(backBtn);
	}
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
	headerListings.replaceChildren(...currentHeaderBtns);
	headerBreadcrumbs.textContent = currentPath.length > 0
		? "In " + currentPath.join(" > ") + ":⠀"
		: "";
}
function traverse(objTree, path) {
	for (const pathSeg of path) {
		objTree = objTree[pathSeg];
	}
	return objTree;
}
update();

function importFile() {
	showFilePicker()
}