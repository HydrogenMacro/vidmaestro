import ParseGraph from "./parsegraph.js";
const propertyTypes = [
	"Number",
	"String",
	"Bool",
	"Component",
	"Color",
	"FrameTime"
];
const parseGraph = new ParseGraph("initial");
const NUMBER = String.raw`\-?\d+`;
parseGraph.addConnection("initial", String.raw`\s*`, "leadingWhitespace");
parseGraph.addConnection(
	"leadingWhitespace",
	String.raw`"`,
	"wrappedDisplayNameStart"
);
parseGraph.addConnection("leadingWhitespace", String.raw`\w+`, "displayName");
parseGraph.addConnection(
	"wrappedDisplayNameStart",
	String.raw`[\w\s]+`,
	"wrappedDisplayName"
);
parseGraph.addConnection(
	"wrappedDisplayName",
	String.raw`"`,
	"wrappedDisplayNameEnd"
);
parseGraph.addConnection(
	["displayName", "wrappedDisplayNameEnd"],
	String.raw`\(`,
	"explicitFieldNameStart"
);
parseGraph.addConnection(
	"explicitFieldNameStart",
	String.raw`\w+`,
	"explicitFieldName"
);
parseGraph.addConnection(
	"explicitFieldName",
	String.raw`\)`,
	"explicitFieldNameEnd"
);
parseGraph.addConnection(
	["displayName", "wrappedDisplayNameEnd", "explicitFieldNameEnd"],
	String.raw`:\s*`,
	"typeDeclarationOperator"
);
parseGraph.addConnection(
	"typeDeclarationOperator",
	`${propertyTypes.join("|")}`,
	"baseType"
);
parseGraph.addConnection(
	"baseType",
	String.raw`\[\s*`,
	"startArrayDeclaration"
);
parseGraph.addConnection("startArrayDeclaration", NUMBER, "arrayMinLength");
parseGraph.addConnection(
	["startArrayDeclaration", "arrayMinLength"],
	String.raw`~`,
	"arrayLengthRangeSeparator"
);
parseGraph.addConnection("arrayLengthRangeSeparator", NUMBER, "arrayMaxLength");
parseGraph.addConnection(
	["startArrayDeclaration", "arrayLengthRangeSeparator", "arrayMaxLength"],
	"s*]",
	"endArrayDeclaration"
);
parseGraph.addConnection(
	["baseType", "endArrayDeclaration"],
	String.raw`@`,
	"boundsDeclaration"
);
parseGraph.addConnection("boundsDeclaration", NUMBER, "boundsMin");
parseGraph.addConnection(
	["boundsDeclaration", "boundsMin"],
	"~",
	"boundsRangeSeparator"
);
parseGraph.addConnection("boundsRangeSeparator", NUMBER, "boundsMax");
parseGraph.addConnection(
	["baseType", "endArrayDeclaration", "boundsMax", "boundsRangeSeparator"],
	String.raw`<`,
	"startLabelDeclaration"
);
parseGraph.addConnection(
	["startLabelDeclaration", "labelSeparator"],
	String.raw`\w+`,
	"label"
);
parseGraph.addConnection("label", String.raw`,\s*`, "labelSeparator");
parseGraph.addConnection("label", String.raw`>`, "endLabelDeclaration");
parseGraph.addConnection(
	["baseType", "endArrayDeclaration", "boundsMax", "boundsRangeSeparator", "endLabelDeclaration"],
	String.raw`{`,
	"startTagDeclaration"
);
parseGraph.addConnection(
	["startTagDeclaration", "tagSeparator"],
	String.raw`\w+`,
	"tag"
);
parseGraph.addConnection(["tag", "tagValue"], String.raw`,\s*`, "tagSeparator");
parseGraph.addConnection("tag", String.raw`\s*=\s*`, "tagValueOperator");
parseGraph.addConnection("tagValueOperator", String.raw`\w+`, "tagValue");
parseGraph.addConnection(
	["tag", "tagValue"],
	String.raw`}`,
	"endTagDeclaration"
);
parseGraph.addConnection(
	[
		"baseType",
		"endArrayDeclaration",
		"boundsRangeSeparator",
		"boundsMax",
		"endLabelDeclaration",
		"endTagDeclaration",
	],
	String.raw`,?\s*`,
	"initial"
);
const attributeGeneratorParseGraph = parseGraph;
export default attributeGeneratorParseGraph;
