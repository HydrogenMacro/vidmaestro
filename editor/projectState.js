import FrameTime from "./frameTime.js";

const projectState = {
	fps: 60,
	videoSize: [1920, 1080],
	videoSeekPos: FrameTime.zero(),
	selectedVideoComponent: null,
	currentTracks: [],
	currentVideoLength: FrameTime.zero(),
	trackAreaScreenPos: 0,
	focusArea: "video",
	rulerGradationMarkGap: 20,
	trackScaleUnits: [
		new FrameTime(0, 16, 120),
		new FrameTime(0, 32, 120),
		new FrameTime(0, 60, 120),
		new FrameTime(1, 0, 120),
		new FrameTime(2, 0, 120),
		new FrameTime(4, 0, 120),
		new FrameTime(8, 0, 120),
		new FrameTime(15, 0, 120),
		new FrameTime(30, 0, 120),
		new FrameTime(60, 0, 120),
		new FrameTime(120, 0, 120),
		new FrameTime(300, 0, 120),
		new FrameTime(600, 0, 120),
		new FrameTime(1200, 0, 120),
		new FrameTime(2400, 0, 120),
		new FrameTime(4800, 0, 120),
		new FrameTime(9600, 0, 120),
	],
	currentTrackScale: 6,
};
export default projectState;
