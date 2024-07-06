import FrameTime from "./frameTime.js";

const projectState = {
	fps: 60,
	videoSize: [1920, 1080],
	videoSeekPos: FrameTime.zero(),
	selectedVideoComponent: null,
	currentTracks: [[], [], []],
	currentVideoLength: FrameTime.zero(),
	trackZoom: FrameTime.oneSec(), // per 100px
	focusArea: "video",
};
export default projectState;