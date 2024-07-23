import FrameTime from "../frameTime.js";
import projectState from "../projectState.js";
import { degToRad } from "../utils.js";
export default class Component {
	canvas = document.createElement("canvas");
	translation = [0, 0];
	rotation = 0; // degrees
	scale = [1, 1];
	zIndex = 0;
	startTime = FrameTime.zero();
	duration = FrameTime.fromSecs(5);
	static attributes = componentAttributes(); // virtual
	static attributesTree = [];
	static name = "Component";
	isComponent = true;
	trackDisplayElement = null;
	static registerComponentAttributes(componentClass) {
		componentClass.attributesTree = [];
		let currentComponentDescendant = componentClass;
		let i = 0;
		do {
			componentClass.attributesTree.push({
				name: currentComponentDescendant.name,
				attributes: currentComponentDescendant.attributes,
			});
			currentComponentDescendant = Object.getPrototypeOf(
				currentComponentDescendant
			);
			i++;
			if (i > 100) return;
		} while (currentComponentDescendant !== Component);
		componentClass.attributesTree.push({
			name: currentComponentDescendant.name,
			attributes: currentComponentDescendant.attributes,
		});
	}
	constructor() {
		this.canvas.className = "video-component";
		this.ctx = this.canvas.getContext("2d");
	}
	draw(relativeFrameTime) {}
	update() {
		this.canvas.width = projectState.videoSize[0];
		this.canvas.height = projectState.videoSize[1];
		this.ctx.reset();
		this.ctx.translate(this.translation[0], this.translation[1]);
		this.ctx.rotate(degToRad(this.rotation));
	}
	clearCanvas() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	getBoundingBox() {
		return [this.translation[0], this.translation[0], 0, 0];
	}
}

function componentAttributes() {
	return [
		{
			field: "translation",
			alias: "Translation",
			baseType: "Number",
			isArray: true,
			arrayLengthRange: [2, 2],
			valueRange: [-Infinity, Infinity],
			labels: [],
			tags: {},
		},
		{
			field: "rotation",
			alias: "Rotation",
			baseType: "Number",
			isArray: false,
			arrayLengthRange: [-Infinity, Infinity],
			valueRange: [-Infinity, Infinity],
			labels: [],
			tags: {},
		},
		{
			field: "scale",
			alias: "Scale",
			baseType: "Number",
			isArray: true,
			arrayLengthRange: [2, 2],
			valueRange: [-Infinity, Infinity],
			labels: [],
			tags: {},
		},
		{
			field: "zIndex",
			alias: "Z Index",
			baseType: "Number",
			isArray: false,
			arrayLengthRange: [-Infinity, Infinity],
			valueRange: [-Infinity, Infinity],
			labels: [],
			tags: {},
		},
		{
			field: "startTime",
			alias: "Start Time",
			baseType: "FrameTime",
			isArray: false,
			arrayLengthRange: [-Infinity, Infinity],
			valueRange: [-Infinity, Infinity],
			labels: [],
			tags: {},
		},
		{
			field: "duration",
			alias: "Duration",
			baseType: "FrameTime",
			isArray: false,
			arrayLengthRange: [-Infinity, Infinity],
			valueRange: [-Infinity, Infinity],
			labels: [],
			tags: {},
		},
	];
}
