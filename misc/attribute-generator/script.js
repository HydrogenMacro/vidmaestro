import attributeGeneratorParseGraph from "./attributeGeneratorParseGraph.js";
import generateJS from "./jsGenerator.js";
const $ = document.querySelector.bind(document);
const input = $("textarea");
const generateBtn = $("#generate");

generateBtn.onclick = () => {
	$("output").textContent = stringify(parse(input.value));
};

function parse(attrText) {
	let attributeGeneratorOutput = attributeGeneratorParseGraph.parse(attrText);
	if (!Array.isArray(attributeGeneratorOutput)) {
		return "Error parsing character " + attributeGeneratorOutput;
	}
	return generateJS(attributeGeneratorOutput);
}

function stringify(obj) {
	var cleaned = JSON.stringify(obj, null, 2);

	return cleaned.replace(/^[\t ]*"[^:\n\r]+(?<!\\)":/gm, function (match) {
		return match.replace(/"/g, "");
	});
}
