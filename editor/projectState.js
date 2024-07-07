import FrameTime from "./frameTime.js";

const projectState = {
	fps: 60,
	videoSize: [1920, 1080],
	videoSeekPos: FrameTime.zero(),
	selectedVideoComponent: null,
	currentTracks: [[], [], []],
	currentVideoLength: FrameTime.zero(),
	trackAreaScreenPos: 0,
	focusArea: "video",
	rulerGradationMarkGap: 20,
};
export default projectState;