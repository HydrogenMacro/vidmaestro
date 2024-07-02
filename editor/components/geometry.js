import Component from "./component.js";
import { rotateBoundingBox } from "../utils.js";
export default class PolygonComponent extends Component {
	fill = "purple";
	_points = [
		[0, 0],
		[30, 30],
		[-30, 30],
	];
	_localBounds = [];
	constructor(startTime, duration) {
		super(startTime, duration);
		this._calcLocalBounds();
	}
	draw(ctx, relativeFrame) {
		ctx.fillStyle = this.fill;
		let [lastX, lastY] = this._points[this._points.length - 1];
		ctx.moveTo(lastX, lastY);
		for (let i = 0; i < this._points.length; i++) {
			let [x, y] = this._points[i];
			ctx.lineTo(x, y);
		}
		ctx.fill();
	}
	getBoundingBox() {
		const [rx, ry, w, h] = this._localBounds;
		const [x, y] = this.translation;
		return rotateBoundingBox([x + rx, y + ry, w, h], this.rotation);
	}
	setPoints(newPoints) {
		this._points = newPoints;
		this._calcBoundingBox();
	}
	_calcLocalBounds() {
		let xmin = Infinity;
		let xmax = -Infinity;
		let ymin = Infinity;
		let ymax = -Infinity;
		for (const [x, y] of this._points) {
			if (x > xmax) xmax = x;
			if (x < xmin) xmin = x;
			if (y > ymax) ymax = y;
			if (y < ymin) ymin = y;
		}
		this._localBounds = [xmin, ymin, xmax - xmin, ymax - ymin];
	}
}
