export function rotateBoundingBox(boundingBox, rot) {
	if (rot === 0) return boundingBox;
	let [x, y, w, h] = boundingBox;
	const { sin, cos, abs } = Math;
	// normalize rot to be between -pi and pi
	rot -= 2 * Math.PI * Math.floor((rot + Math.PI) / (2 * Math.PI))
	return [
		x + cos(rot) * w,
		y - sin(rot) * h,
		w,
		h
	];
}