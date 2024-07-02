import Operation from "./operation.js";

export default class GroupOperation extends Operation {
	components = [];
	draw(ctx, relativeFrame) {
		for (const component of this.components) {
			component.draw(ctx, relativeFrame);
		}
	}
}
