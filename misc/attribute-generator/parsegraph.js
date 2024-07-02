class ParseGraph {
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
				return -1;
			}
			for (const [edgeRegex, toVertex] of this.connections.get(state)) {
				let edgeMatch = edgeRegex.exec(text.substring(i));
				console.log(text.substring(i), toVertex, edgeRegex)
				if (edgeMatch) {
					hasValidEdge = true;
					output.push([toVertex, edgeMatch[0]]);
					state = toVertex;
					i += edgeMatch[0].length;
					break;
				};
				
			}
			if (!hasValidEdge) {
				//error
				return i;
			}
		}
		return output;
	}
}
const propertyTypes = ["Number", "String", "Bool", "Boolean", "Component", "Color"]
const parseGraph = new ParseGraph("initial");
const NUMBER = String.raw`\-?\d+`;
parseGraph.addConnection("initial", String.raw`\s*`, "leadingWhitespace");
parseGraph.addConnection("leadingWhitespace", String.raw`"`, "wrappedDisplayNameStart");
parseGraph.addConnection("leadingWhitespace", String.raw`\w+`, "displayName");
parseGraph.addConnection("wrappedDisplayNameStart", String.raw`\w+`, "wrappedDisplayName");
parseGraph.addConnection("wrappedDisplayName", String.raw`"`, "wrappedDisplayNameEnd");
parseGraph.addConnection(["displayName", "wrappedDisplayNameEnd"], String.raw`\(`, "explicitFieldNameStart");
parseGraph.addConnection("explicitFieldNameStart", String.raw`\w+`, "explicitFieldName");
parseGraph.addConnection("explicitFieldName", String.raw`\)`, "explicitFieldNameEnd");
parseGraph.addConnection(["displayName", "wrappedDisplayNameEnd", "explicitFieldNameEnd"], String.raw`:\s*`, "typeDeclarationOperator");
parseGraph.addConnection("typeDeclarationOperator", `${propertyTypes.join("|")}`, "baseType");
parseGraph.addConnection("baseType", String.raw`\[\s*`, "startArrayDeclaration");
parseGraph.addConnection("startArrayDeclaration", NUMBER, "arrayMinLength");
parseGraph.addConnection(["startArrayDeclaration", "arrayMinLength"], String.raw`~`, "arrayLengthRangeSeparator");
parseGraph.addConnection("arrayLengthRangeSeparator", NUMBER, "arrayMaxLength");
parseGraph.addConnection(["startArrayDeclaration", "arrayLengthRangeSeparator", "arrayMaxLength"], "\s*\]", "endArrayDeclaration");
parseGraph.addConnection(["baseType", "endArrayDeclaration"], String.raw`@`, "boundsDeclaration");
parseGraph.addConnection("boundsDeclaration", NUMBER, "boundsMin");
parseGraph.addConnection(["boundsDeclaration", "boundsMin"], "~", "boundsRangeSeparator");
parseGraph.addConnection("boundsRangeSeparator", NUMBER, "boundsMax");
parseGraph.addConnection(["baseType", "endArrayDeclaration", "boundsMax"], String.raw`<`, "startLabelDeclaration");
parseGraph.addConnection(["startLabelDeclaration", "labelSeparator"], String.raw`\w`, "label");
parseGraph.addConnection("label", String.raw`,\s*`, "labelSeparator");
parseGraph.addConnection("label", String.raw`>`, "endLabelDeclaration");
parseGraph.addConnection(["baseType", "endArrayDeclaration", "boundsMax", "endLabelDeclaration"], String.raw`,?\s`, "initial");
console.log(parseGraph.parse(`"abc"(def): Number[-2~93]@0~255, bc:String[]<a, b>`));
