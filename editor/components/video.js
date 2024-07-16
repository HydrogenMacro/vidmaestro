import Component from "./component.js";
export default class VideoComponent extends Component {
	name = "Video"
	video = null;
	videoStartTime = 0
}
Component.registerComponentAttributes(VideoComponent);