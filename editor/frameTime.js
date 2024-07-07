import projectState from "./projectState.js";

export default class FrameTime {
	constructor(secs, frame, fps) {
		assertFPS(fps);
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
		assertFPS(fps);
		return this.frame * (fps / 120);
	}
	toSecs() {
		return this.secs + this.frame / 120;
	}
	toFormattedString() {
		const secs = String(this.secs % 60).padStart(2, "0");
		const mins = String(Math.floor(this.secs / 60) % 60).padStart(2, "0");
		const hrs = String(Math.floor(this.secs / (60 * 60))).padStart(2, "0");
		return `${hrs}:${mins}:${secs} ${this.getFrameWithFPS(
			projectState.fps
		)}/${projectState.fps}`;
	}
	static fromString(frameTimeString) {
		let regex =
			/^(?:(?:(?<hrs>\d+):(?=\d+:\d+))?(?:(?<mins>\d+):)?(?<secs>\d+)?(?:(?: ?(?:(?<frame>\d+)(?:\/(?<fps>\d+))?))|(?<secsDecimal>\.\d+)))$/;
		let groups = regex.exec(frameTimeString)?.groups;
		if (groups) {
			let { hrs, mins, secs, secsDecimal, frame, fps } = groups;
			if (!(secs || frame)) return null;
			if (secs && !mins) {
				// only secs
				hrs = Math.floor(+secs / (60 * 60));
				mins = Math.floor(+secs / 60) % 60;
				secs = +secs % 60;
			} else {
				hrs = +(hrs || 0);
				mins = +(mins || 0);
				secs = +(secs || 0);
			}
			if (secsDecimal) {
				frame = Math.floor(parseFloat(secsDecimal) * 120);
				fps = 120;
			} else {
				frame = +(frame || 0);
				fps = +(fps || projectState.fps);
			}
			if (
				mins >= 60 ||
				secs >= 60 ||
				frame > fps ||
				fps % 4 !== 0 ||
				fps > 120
			)
				return null;
			return new FrameTime(hrs * 60 * 60 + mins * 60 + secs, frame, fps);
		}
		return null;
	}
	static add(t1, t2) {
		let combinedFrameLength = t1.frame + t2.frame;
		if (combinedFrameLength > 120) {
			return new FrameTime(
				t1.secs + t2.secs + 1,
				combinedFrameLength - 120,
				120
			);
		} else {
			return new FrameTime(t1.secs + t2.secs, combinedFrameLength, 120);
		}
	}
	static multiply(t1, amount) {
		let multipliedFrame = t1.frame * amount;
		let rem = multipliedFrame % 120;
		let additionalSecs = (multipliedFrame - rem) / 120;
		return new FrameTime(t1.secs * amount + additionalSecs, rem, 120);
	}
	static zero = () => FrameTime.fromSecs(0);
	static oneSec = () => FrameTime.fromSecs(1);
}
function assertFPS(fps) {
	if (fps % 4 !== 0) throw new Error("FrameTime: FPS must be multiple of 4");
	if (fps > 120)
		throw new Error("FrameTime: FPS must be less than or equal to 120");
}
