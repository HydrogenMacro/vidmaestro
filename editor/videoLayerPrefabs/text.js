import VideoLayer from "../videoLayer.js";
const measureCtx = document.createElement("canvas").getContext("2d");
export default class TextLayer extends VideoLayer {
	text = "abacadabra"
	font = ""
	fill = "green"
	stroke = "white"
	constructor(startTime, duration) {
		super(startTime, duration);
	}
	draw(ctx, relativeFrame) {
		console.log(this.ctx.getTransform())
		ctx.font = this.font;
		ctx.fillStyle = this.fill;
		ctx.strokeStyle = this.stroke;
		const textHeight = ctx.measureText(this.text).fontBoundingBoxAscent;
		ctx.fillText(this.text, 0, textHeight);
	}
	getBoundingBox() {
		measureCtx.font = this.font;
		measureCtx.fillStyle = this.fill;
		measureCtx.strokeStyle = this.stroke;
		const textMeasurement = measureCtx.measureText(this.text);
		return [
			this.translation[0],
			this.translation[1],
			textMeasurement.width,
			textMeasurement.fontBoundingBoxAscent
		];
	}
}