import VideoLayer from "../videoLayer.js";
const measureCtx = document.createElement("canvas").getContext("2d");
export default class TextLayer extends VideoLayer {
	text = "abacadabra"
	font = ""
	fill = "green"
	draw(ctx, relativeFrame) {
		console.log(this.ctx.getTransform())
		ctx.font = this.font;
		ctx.fillStyle = this.fill;
		const textHeight = ctx.measureText(this.text).fontBoundingBoxAscent;
		ctx.fillText(this.text, 0, textHeight);
	}
	getBoundingBox() {
		measureCtx.font = this.font;
		measureCtx.fillStyle = this.fill;
		const textMeasurement = measureCtx.measureText(this.text);
		return rotateBoundingBox([
			this.translation[0] ,
			this.translation[1],
			textMeasurement.width,
			textMeasurement.fontBoundingBoxAscent
		], this.rotation);
	}
}
function rotateBoundingBox(boundingBox, rot) {
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