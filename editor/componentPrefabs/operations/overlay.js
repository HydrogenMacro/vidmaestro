import { mergeBoundingBoxes } from "../../utils.js";
import Operation from "./operation.js";

export default class OverlayOperation extends Operation {
    operationCtx = document.createElement("canvas").getContext("2d");
    constructor() {
        super();
        this._calcBoundingBox();
    }
    draw(ctx, relativeFrame) {
        this.operationCtx.reset();
        this.operationCtx.globalAlpha = 1 / this.args.length;
        for (const component of this.args) {
            component.draw(this.operationCtx, relativeFrame);
        }
        ctx.drawImage(this.operationCtx.canvas, 0, 0);
    }
}