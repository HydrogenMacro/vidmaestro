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