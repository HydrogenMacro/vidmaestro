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
	return t.content.firstElementChild;
}

function _quicksort(array, lo, hi, mapFn) {
	if (lo >= hi || lo < 0) return;
	let pivot = partition(array, lo, hi, mapFn);
	quicksort(array, lo, pivot - 1, mapFn);
	quicksort(array, pivot + 1, hi, mapFn);
	function partition(array, lo, hi, mapFn) {
		let i = lo;
		for (let j = lo; j < hi; j++) {
			if (mapFn(array[j]) <= mapFn(array[i])) {
				[array[i], array[j]] = [array[j], array[i]];
				i += 1;
			}
		}
		[array[i], array[hi]] = [array[hi], array[i]];
		return i;
	}
}

export function quicksort(array, mapFn = a => a) {
	_quicksort(array, 0, array.length - 1, mapFn);
}
export function clamp(x, min, max) {
	return Math.min(Math.max(x, min), max);
}
export function lerp(x, target, progress) {
	return (target - x) * progress + x;
}
export function easeOut(x) {
	return 1 - Math.pow(1 - x, 5);
}
export function removeAllChildren(elem) {
	while (elem.lastElementChild) {
		elem.removeChild(elem.lastElementChild);
	}
}