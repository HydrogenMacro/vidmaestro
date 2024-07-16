import attributeGeneratorParseGraph from "./attributeGeneratorParseGraph.js";
import generateJS from "./jsGenerator.js";
const $ = document.querySelector.bind(document);
const input = $("textarea");
const generateBtn = $("#generate");

generateBtn.onclick = () => {
	$("output").innerText = stringify(parse(input.value));
	console.log(parse(input.value));
};

function parse(attrText) {
	let attributeGeneratorOutput = attributeGeneratorParseGraph.parse(attrText);
	if (!Array.isArray(attributeGeneratorOutput)) {
		return "Error parsing character " + attributeGeneratorOutput;
	}
	return generateJS(attributeGeneratorOutput);
}

function stringify(obj) {
	var cleaned = JSON.stringify(
		obj,
		(key, value) => {
			if (value === Infinity) {
				return "$$__ATTRIBUTE_GENERATOR_PARSE_GRAPH__Infinity";
			}
			if (value === -Infinity) {
				return "$$__ATTRIBUTE_GENERATOR_PARSE_GRAPH__Neg_Infinity";
			}
			return value;
		},
	)
		.replaceAll("\"$$__ATTRIBUTE_GENERATOR_PARSE_GRAPH__Infinity\"", "Infinity")
		.replaceAll("\"$$__ATTRIBUTE_GENERATOR_PARSE_GRAPH__Neg_Infinity\"", "-Infinity");

	return cleaned.replace(/^[\t ]*"[^:\n\r]+(?<!\\)":/gm, function (match) {
		return match.replace(/"/g, "");
	});
}
