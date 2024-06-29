import { resizeCallbacks } from "./panelSizes.js";
import projectState from "./projectState.js";
export default class Layer {
	translation = [0, 0]
	rotation = 0 // radians
	zIndex = 0
	constructor(startTime, duration) {
		this.className = "video-layer";
		this.startTime = startTime;
		this.duration = duration;
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");
	}
	draw(ctx, relativeFrame) {}
	display() {
		this.canvas.width = this.canvas.parentElement.clientWidth;
		this.canvas.height = this.canvas.parentElement.clientHeight;
		this.ctx.reset();
		if (
			projectState.videoSeekPos < this.startTime
			|| projectState.videoSeekPos > this.startTime + this.duration
		) return;
		this.ctx.translate(this.translation[0], this.translation[1]);
		this.ctx.rotate(this.rotation);
		this.draw(this.ctx, projectState.videoSeekPos - this.startTime);
	}
	getBoundingBox() {
		return [this.translation[0], this.translation[0], 0, 0];
	}
}