import FrameTime from "./frameTime.js";

const projectState = {
	fps: 60,
	videoSize: [1920, 1080],
	videoSeekPos: FrameTime.ZERO,
	selectedVideoComponent: null,
	currentTracks: [[], [], []],
	currentVideoLength: FrameTime.ZERO,
	trackZoom: FrameTime.ONE_SEC, // per 100px
	focusArea: "video",
};
export default projectState;