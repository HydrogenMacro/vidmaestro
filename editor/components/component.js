import FrameTime from "../frameTime.js";
import { resizeCallbacks } from "../panelSizes.js";
import projectState from "../projectState.js";
export default class Component {
	translation = [0, 0];
	rotation = 0; // radians
	scale = [1, 1];
	zIndex = 0;
	startTime = FrameTime.zero();
	duration = FrameTime.zero();
	parentAttributes = [];
	attributes = componentAttributes();
	name = "Component";
	isComponent = true;
	trackDisplayElement = null;
	constructor() {
		this.canvas = document.createElement("canvas");
		this.canvas.className = "video-component";
		this.ctx = this.canvas.getContext("2d");
		this.parentAttributes.push({
			name: this.name,
			attributes: this.attributes,
		});
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
