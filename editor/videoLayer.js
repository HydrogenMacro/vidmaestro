import { resizeCallbacks } from "./panelSizes.js";
import projectState from "./projectState.js";
export default class VideoLayer extends HTMLCanvasElement {
	constructor(startTime, duration, drawFn) {
		super();
		this.className = "video-layer";
		this.startTime = startTime;
		this.duration = duration;
		this.drawFn = drawFn;
		this.ctx = this.getContext("2d");
	}
	draw() {
		this.width = this.parentElement.clientWidth;
		this.height = this.parentElement.clientHeight;
		if (
			projectState.videoSeekPos < this.startTime 
			|| projectState.videoSeekPos > this.startTime + this.duration
		) {
			this.drawFn(this.ctx, projectState.videoSeekPos - this.startTime);
			this.ctx.reset();
		}
	}
}