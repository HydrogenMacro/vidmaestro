import FrameTime from "./frameTime.js";
import projectState from "./projectState.js";
import { updateTrackLength } from "./ui/trackArea.js";
import { quicksort } from "./utils.js";
const videoRenderCanvas = document.createElement("canvas");
const videoRenderCtx = videoRenderCanvas.getContext("2d");
document.body.insertAdjacentElement("afterbegin", videoRenderCanvas);
async function generateVideo() {
	const videoRenderMediaSource = new MediaSource();
	updateTrackLength();
	let sortedComponents = projectState.currentTracks.flat();
	quicksort(sortedComponents, (c) => c.zIndex);
	videoRenderCanvas.width = projectState.videoSize[0];
	videoRenderCanvas.height = projectState.videoSize[1];
	await new Promise(res => videoRenderMediaSource.onsourceopen = res);
	const videoRenderSourceBuffer = videoRenderMediaSource.addSourceBuffer("video/webm")
	for (
		let frame = 0;
		frame < projectState.currentVideoLength.toFrames(projectState.fps);
		frame += 1
	) {
		videoRenderCtx.clearRect(
			0,
			0,
			projectState.videoSize[0],
			projectState.videoSize[1]
		);
		for (const component of sortedComponents) {
			let startTimeInFrames = component.startTime.toFrames(
				projectState.fps
			);
			if (startTimeInFrames > frame) continue;
			if (
				startTimeInFrames +
					component.duration.toFrames(projectState.fps) <
				frame
			)
				continue;
			component.update();
			console.log("drawing", component.text)
			component.draw(FrameTime.fromFrames(frame - startTimeInFrames, projectState.fps));
			videoRenderCtx.drawImage(
				component.canvas,
				0,
				0
			);
			
		}
		
	}
}
const a = await generateVideo();
console.log(a)