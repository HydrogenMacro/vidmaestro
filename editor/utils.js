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
	let x_min = 0;
	let y_min = 0;
	let x_max = 0;
	let y_max = 0;
	if (rot > 0) {
		if (rot < Math.PI / 2)
		{
			y_min = y;
			y_max = y + hct + wst;
			x_min = x - hst;
			x_max = x + wct;
		}
    else
		{
			y_min = y + hct;
			y_max = y + wst;
			x_min = x - hst + wct;
			x_max = x;
		}
	}
	else {
		if (rot > -Math.PI / 2) {
			y_min = y + wst;
			y_max = y + hct;
			x_min = x;
			x_max = x + wct - hst;
		}
		else {
			y_min = y + wst + hct;
			y_max = y;
			x_min = x + wct;
			x_max = x - hst;
		}
	}
	return [
		x_min,
		y_min,
		x_max - x_min,
		y_max - y_min
	];
}