import Operation from "./operation.js";

export default class GroupOperation extends Operation {
	components = [];
	draw(relativeFrame) {
		for (const component of this.components) {
			component.draw(relativeFrame);
			this.ctx.drawImage(component.canvas, 0, 0);
		}
	}
}
Component.registerComponent(GroupOperation);