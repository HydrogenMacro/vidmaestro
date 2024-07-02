import { resizeCallbacks } from "../panelSizes.js";
import projectState from "../projectState.js";
export default class Component {
	translation = [0, 0];
	rotation = 0; // radians
	zIndex = 0;
	startTime = 0;
	duration = 0;
	attributes = attributes();
	constructor() {
		this.canvas = document.createElement("canvas");
		this.canvas.className = "video-component";
		this.ctx = this.canvas.getContext("2d");
	}
	draw(ctx, relativeFrame) {}
	display() {
		this.canvas.width = this.canvas.parentElement.clientWidth;
		this.canvas.height = this.canvas.parentElement.clientHeight;
		this.ctx.reset();
		if (
			projectState.videoSeekPos < this.startTime ||
			projectState.videoSeekPos > this.startTime + this.duration
		)
			return;
		this.ctx.translate(this.translation[0], this.translation[1]);
		this.ctx.rotate(this.rotation);
		this.draw(this.ctx, projectState.videoSeekPos - this.startTime);
	}
	getBoundingBox() {
		return [this.translation[0], this.translation[0], 0, 0];
	}
}

function attributes() {
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
