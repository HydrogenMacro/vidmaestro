export default function generateJS(parseGraphOutput) {
	const output = [];
	let currentObj = null;
	let currentTag = "";
	for (const [type, value] of parseGraphOutput) {
		switch (type) {
			case "displayName":
			case "wrappedDisplayName":
				output.push({
					field: value,
					alias: value,
					baseType: null,
					isArray: false,
					arrayLengthRange: [-Infinity, Infinity],
					valueRange: [-Infinity, Infinity],
					labels: [],
					tags: {},
				});
				currentObj = output[output.length - 1];
				break;
			case "explicitFieldName":
				currentObj.field = value;
				break;
			case "baseType":
				currentObj.baseType = value;
				break;
			case "startArrayDeclaration":
				currentObj.isArray = true;
				break;
			case "arrayMinLength":
				currentObj.arrayLengthRange[0] = +value;
				break;
			case "arrayMaxLength":
				currentObj.arrayLengthRange[1] = +value;
				break;
			case "boundsMin":
				currentObj.valueRange[0] = +value;
				break;
			case "boundsMax":
				currentObj.valueRange[1] = +value;
				break;
			case "label":
				currentObj.labels.push(value);
				break;
			case "tag":
				currentObj.tags[value] = true;
				currentTag = value;
				break;
			case "tagValue":
				currentObj.tags[currentTag] = value;
				break;
		}
	}
	return output;
}
