import projectState from "./projectState.js";

export function rotateBoundingBox(boundingBox, rot) {
	if (rot === 0) return boundingBox;
	let [x, y, w, h] = boundingBox;
	const { sin, cos, abs } = Math;
	// normalize rot to be between -pi and pi
	rot -= 2 * Math.PI * Math.floor((rot + Math.PI) / (2 * Math.PI));
	const hct = h * cos(rot);
	const hst = h * sin(rot);
	const wct = w * cos(rot);
	const wst = w * sin(rot);
	// thanks https://stackoverflow.com/a/624082/20913545
	if (rot > 0) {
		if (rot < Math.PI / 2) {
			return [
				x - hst,
				y,
				wct + hst,
				hct + wst
			]
		}
		else {
			return [
				x - hst + wct,
				y + hct,
				hst - wct,
				wst - hct
			];
		}
	} else {
		if (rot > -Math.PI / 2) {
			return [
				x,
				y + wst,
				wct - hst,
				hct - wst
			];
		}
		else {
			return [
				x + wct,
				y + wst + hct,
				-hst - wct,
				-wst - hct,
			];
		}
	}

}
export function mergeBoundingBoxes(firstBoundingBox, ...boundingBoxes) {
	let [mbx, mby, mbw, mbh] = structuredClone(firstBoundingBox);
	for (const [bx, by, bw, bh] of boundingBoxes) {
		mbx = Math.min(mbx, bx);
		mby = Math.min(mby, by);
		mbw = Math.max(mbx + mbw, bx + bw) - mbx;
		mbh = Math.max(mby + mbh, by + bh) - mby;
	}
	return [mbx, mby, mbw, mbh];
}

export function parseHTML(html) {
	// https://stackoverflow.com/a/34333750/20913545
	var t = document.createElement("template");
	t.innerHTML = html;
	return t.content;
}
export function secsToFrameTime(secs) {
	return [
		Math.floor(secs),
		Math.round((secs - Math.floor(secs)) * projectState.fps),
		projectState.fps
	];
}
export function frameTimeToSecs([frameTimeSecs, frameTimeFrames, fps]) {
	return frameTimeSecs + frameTimeFrames / fps;
}
export function updateFrameTime(frameTime) {
	let [frameTimeSecs, frameTimeFrames, fps] = frameTime;
	if (fps === projectState.fps) return frameTime;
	return secsToFrameTime(frameTimeToSecs(frameTime));
}
export const frameTime = secsToFrameTime;