import FrameTime from "../frameTime.js";
import projectState from "../projectState.js";

const seekPosInput = document.querySelector("#video-control-seek-pos");
seekPosInput.addEventListener("click", () => {
	seekPosInput.select();
})
seekPosInput.addEventListener("change", () => {
	seekPosInput.blur();
	if (!Number.isNaN(+seekPosInput.value)) {
		projectState.videoSeekPos = FrameTime.fromSecs(+seekPosInput.value);
	}
	updateSeekPosInput();
});

function updateSeekPosInput() {
	console.log(projectState.videoSeekPos)
	seekPosInput.value = projectState.videoSeekPos.toFormattedString();
	seekPosInput.style.fontSize = Math.max(1 / Math.sqrt(seekPosInput.value.length * .35), .5) + "rem"
}
updateSeekPosInput();