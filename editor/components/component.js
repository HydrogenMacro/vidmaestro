import FrameTime from "../frameTime.js";
import { resizeCallbacks } from "../panelSizes.js";
import projectState from "../projectState.js";
export default class Component {
	canvas = document.createElement("canvas");
	translation = [0, 0];
	rotation = 0; // radians
	scale = [1, 1];
	zIndex = 0;
	startTime = FrameTime.zero();
	duration = FrameTime.fromSecs(5);
	static attributes = componentAttributes(); // virtual
	static attributesTree = [];
	static name = "Component";
	isComponent = true;
	trackDisplayElement = null;
	static registerComponentAttributes(componentClass) {
		componentClass.attributesTree = [];
		let currentComponentDescendant = componentClass;
		let i = 0;
		do {
			componentClass.attributesTree.push({
				name: currentComponentDescendant.name,
				attributes: currentComponentDescendant.attributes,
			});
			currentComponentDescendant = Object.getPrototypeOf(
				currentComponentDescendant
			);
			i++;
			if (i > 100) return;
		} while (currentComponentDescendant !== Component);
		componentClass.attributesTree.push({
			name: currentComponentDescendant.name,
			attributes: currentComponentDescendant.attributes,
		});
		console.log(componentClass.attributesTree)
	}
	constructor() {
		this.canvas.className = "video-component";
		this.ctx = this.canvas.getContext("2d");
	}
	draw(relativeFrame) {}
	update() {
		this.canvas.width = projectState.videoSize[0];
		this.canvas.height = projectState.videoSize[1];
		this.ctx.reset();
		this.ctx.translate(this.translation[0], this.translation[1]);
		this.ctx.rotate(this.rotation);
	}
	getBoundingBox() {
		return [this.translation[0], this.translation[0], 0, 0];
	}
}

function componentAttributes() {
	return [
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
	];
}
