import { quicksort } from "./utils.js";
import FrameTime from "./frameTime.js";
import projectState from "./projectState.js";
// only dependency!
import {
	Muxer,
	ArrayBufferTarget,
} from "https://cdn.jsdelivr.net/npm/webm-muxer/+esm";
import { updateTrackLength } from "./ui/trackArea.js";

export async function generateVideo() {
	updateTrackLength();
	const videoRenderCanvas = new OffscreenCanvas(
		projectState.videoSize[0],
		projectState.videoSize[1]
	);
	const videoRenderCtx = videoRenderCanvas.getContext("2d");
	let videoMuxer = new Muxer({
		target: new ArrayBufferTarget(),
		video: {
			codec: "V_VP9",
			width: projectState.videoSize[0],
			height: projectState.videoSize[1],
		},
	});
	let sortedComponents = projectState.currentTracks.flat();
	quicksort(sortedComponents, (c) => c.zIndex);
	const videoEncoder = new VideoEncoder({
		output: (chunk, meta) => videoMuxer.addVideoChunk(chunk, meta),
		error: (e) => console.error(e),
	});
	videoEncoder.configure({
		codec: "vp09.00.10.08",
		width: projectState.videoSize[0],
		height: projectState.videoSize[1],
		bitrate: 1e6,
	});
	for (
		let frame = 0;
		frame < projectState.currentVideoLength.toFrames(projectState.fps);
		frame += 1
	) {
		videoRenderCtx.save();
		videoRenderCtx.fillStyle = "white";
		videoRenderCtx.fillRect(
			0,
			0,
			projectState.videoSize[0],
			projectState.videoSize[1]
		);
		videoRenderCtx.restore();
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
			component.draw(
				FrameTime.fromFrames(
					frame - startTimeInFrames,
					projectState.fps
				)
			);
			videoRenderCtx.drawImage(component.canvas, 0, 0);
		}
		const videoFrame = new VideoFrame(videoRenderCanvas, {
			timestamp: Math.round((frame / projectState.fps) * 1000000),
		});
		videoEncoder.encode(videoFrame);
		videoFrame.close();
	}
	await videoEncoder.flush();
	videoMuxer.finalize();
	return URL.createObjectURL(
		new Blob([videoMuxer.target.buffer], { type: "video/webm" })
	);
}
