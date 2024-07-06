import projectState from "./projectState.js";

export default class FrameTime {
	constructor(secs, frame, fps) {
		validateFPS(fps);
		if (frames > fps)
			throw new Error(
				"FrameTime: Frame must be less than or equal to FPS"
			);
		this.secs = secs;
		this.frame = frame / (fps / 120);
	}
	static fromSecs(secs) {
		return new FrameTime(
			Math.floor(secs),
			Math.floor((secs - Math.floor(secs)) * 120),
			120
		);
	}
	getFrameWithFPS(fps) {
		validateFPS(fps);
		return this.frame * (fps / 120);
	}
	toSecs() {
		return this.secs + this.frame / 120;
	}
	toFormattedString() {
		const secs = this.secs % 60;
		const mins = Math.floor(this.secs / 60);
		const hrs = Math.floor(this.secs / (60 * 60));
		return `${hrs}:${mins}:${secs} ${this.getFrameWithFPS(projectState.fps)}/${projectState.fps}`;
	}
	static add(t1, t2) {
		let combinedFrameLength = t1.frame + t2.frame;
		if (combinedFrameLength > 120) {
			return new FrameTime(t1.secs + t2.secs + 1, combinedFrameLength - 120, 120);
		} else {
			return new FrameTime(t1.secs + t2.secs, combinedFrameLength, 120);
		}
	}
	static multiply(t1, amount) {
		let multipliedFrames = t1.frames * amount;
		let rem = multipliedFrames % 120;
		let additionalSecs = (multipliedFrames - rem) / 120;
		return new FrameTime(t1.secs * amount + additionalSecs, rem, 120);
	}
	static ZERO = FrameTime.fromSecs(0);
	static ONE_SEC = FrameTime.fromSecs(1);
}
function validateFPS(fps) {
	if (fps % 4 !== 0) throw new Error("FrameTime: FPS must be multiple of 4");
	if (fps > 120)
		throw new Error("FrameTime: FPS must be less than or equal to 120");
}
