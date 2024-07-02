import { mergeBoundingBoxes } from "../../utils.js";
import Operation from "./operation.js";

export default class OverlayOperation extends Operation {
	operationCtx = document.createElement("canvas").getContext("2d");
	componentsToBeOverlayed = [];
	draw(ctx, relativeFrame) {
		this.operationCtx.canvas.width = ctx.canvas.width;
		this.operationCtx.canvas.height = ctx.canvas.height;
		this.operationCtx.reset();
		this.operationCtx.globalAlpha = 1 / this.args.length;
		for (const component of this.componentsToBeOverlayed) {
			component.draw(this.operationCtx, relativeFrame);
		}
		ctx.drawImage(this.operationCtx.canvas, 0, 0);
	}
}
