import Component from "./component.js";
export default class VideoComponent extends Component {
	name = "Video"
	video = document.createElement("video");
	videoStartTime = 0;
	static attributes = componentAttributes();
	draw(relativeFrameTime) {

	}
}
Component.registerComponentAttributes(VideoComponent);
function componentAttributes() {
	return [
		{
			field: "videoStartTime",
			alias: "Video Start Time",
			baseType: "Number",
			isArray: false,
			arrayLengthRange: [-Infinity, Infinity],
			valueRange: [0, Infinity],
			labels: [],
			tags: {},
		},
	];
}