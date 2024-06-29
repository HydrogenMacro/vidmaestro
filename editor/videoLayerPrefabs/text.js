import VideoLayer from "../videoLayer.js";

export default class TextLayer extends VideoLayer {
	constructor(startTime, duration, text = "") {
		super(startTime, duration, (ctx, relativeFrame) => {
			ctx.fillRect(2, 2, 10, 342);
		});
	}
}