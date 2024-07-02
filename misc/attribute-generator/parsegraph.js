class ParseGraph {
	constructor(initialVertex, endVertex) {
		this.initial = initialVertex;
		this.end = endVertex;
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
				.push([RegExp(regexEdge), toVertex]);
		}
	}
	parse(text) {
		let state = this.initial;
		let output = [];
		let i = 0;
		while (state !== this.end) {
			console.log(state, this.end)
			let hasValidEdge = false;
			for (const [edgeRegex, toVertex] of this.connections.get(state)) {
				let edgeMatch = edgeRegex.exec(text.substring(i));
				console.log(edgeRegex, edgeMatch)
				if (edgeMatch) {
					hasValidEdge = true;
					output.push([state, edgeMatch[0]]);
					state = toVertex;
					i += edgeMatch[0].length;
					break;
				};
			}
			console.log(state)
			if (!hasValidEdge) {
				//error
				return i;
			}
		}
		return output;
	}
}
const parseGraph = new ParseGraph("initialWhitespace", "end");
parseGraph.addConnection("initialWhitespace", String.raw`"`, "wrappedDisplayNameStart");
parseGraph.addConnection("initialWhitespace", String.raw`\w+`, "displayName");
parseGraph.addConnection("wrappedDisplayNameStart", String.raw`\w+`, "wrappedDisplayName");
parseGraph.addConnection("wrappedDisplayName", String.raw`"`, "wrappedDisplayNameEnd");
parseGraph.addConnection(["displayName", "wrappedDisplayNameEnd"], String.raw`\(`, "explicitFieldNameStart");
parseGraph.addConnection("explicitFieldNameStart", String.raw`\w+`, "explicitFieldName");
parseGraph.addConnection("explicitFieldName", String.raw`\)`, "end");
console.log(parseGraph.parse(`"abc"(def)`));
