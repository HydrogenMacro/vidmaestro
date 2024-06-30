import Component from "../component.js";
import { rotateBoundingBox } from "../utils.js";
const measureCtx = document.createElement("canvas").getContext("2d");
export default class TextComponent extends Component {
	text = "abacadabra"
	font = ""
	fill = "green"
	draw(ctx, relativeFrame) {
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
