export default class ParseGraph {
	constructor(initialVertex) {
		this.initial = initialVertex;
		this.connections = new Map();
	}
	addConnection(fromVertecies, regexEdge, toVertex) {
		fromVertecies = Array.isArray(fromVertecies)
			? fromVertecies
			: [fromVertecies];
		for (const fromVertex of fromVertecies) {
			if (!this.connections.has(fromVertex)) {
				this.connections.set(fromVertex, []);
			}
			this.connections
				.get(fromVertex)
				.push([RegExp("^(" + regexEdge + ")"), toVertex]);
		}
	}
	parse(text) {
		let state = this.initial;
		let output = [];
		let i = 0;
		while (i < text.length) {
			let hasValidEdge = false;
			if (!this.connections.get(state)) {
				// error
				return i;
			}
			for (const [edgeRegex, toVertex] of this.connections.get(state)) {
				let edgeMatch = edgeRegex.exec(text.substring(i));
				if (edgeMatch) {
					hasValidEdge = true;
					output.push([toVertex, edgeMatch[0]]);
					state = toVertex;
					i += edgeMatch[0].length;
					break;
				}
			}
			if (!hasValidEdge) {
				//error
				return i;
			}
		}
		return output;
	}
}
