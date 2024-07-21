import Component from "./component.js";
import { rotateBoundingBox } from "../utils.js";
export default class TextComponent extends Component {
	name = "Text";
	text = "";
	font = "monospace";
	fontSize = 100;
	fill = "green";
	static attributes = componentAttributes();
	draw(relativeFrameTime) {
		this.ctx.font = `${this.fontSize}px ${this.font}`;
		this.ctx.fillStyle = this.fill;
		const textHeight = this.ctx.measureText(
			this.text
		).fontBoundingBoxAscent;
		this.ctx.fillText(this.text, 0, textHeight);
	}
	getBoundingBox() {
		const textMeasurement = this.ctx.measureText(this.text);
		return rotateBoundingBox(
			[
				this.translation[0],
				this.translation[1],
				textMeasurement.width,
				textMeasurement.fontBoundingBoxAscent,
			],
			this.rotation
		);
	}
}
Component.registerComponentAttributes(TextComponent);
function componentAttributes() {
	return [
		{
			field: "text",
			alias: "Text",
			baseType: "String",
			isArray: false,
			arrayLengthRange: [-Infinity, Infinity],
			valueRange: [-Infinity, Infinity],
			labels: [],
			tags: {},
		},
		{
			field: "font",
			alias: "Font",
			baseType: "String",
			isArray: false,
			arrayLengthRange: [-Infinity, Infinity],
			valueRange: [-Infinity, Infinity],
			labels: [],
			tags: {},
		},
		{
			field: "fontSize",
			alias: "Font Size",
			baseType: "Number",
			isArray: false,
			arrayLengthRange: [-Infinity, Infinity],
			valueRange: [0, Infinity],
			labels: [],
			tags: {},
		},
		{
			field: "fill",
			alias: "Fill Color",
			baseType: "Color",
			isArray: false,
			arrayLengthRange: [-Infinity, Infinity],
			valueRange: [-Infinity, Infinity],
			labels: [],
			tags: {},
		},
	];
}
