import { mergeBoundingBoxes } from "../../utils.js";
import Operation from "./operation.js";
import Component from "../component.js";
export default class OverlayOperation extends Operation {
	args = [];
	draw(relativeFrame) {
		this.ctx.globalAlpha = 1 / this.args.length;
		for (const component of this.args) {
			component.draw();
			this.ctx.drawImage(component.canvas, 0, 0);
		}
	}
}
Component.registerComponentAttributes(OverlayOperation);