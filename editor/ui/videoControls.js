import FrameTime from "../frameTime.js";
import projectState from "../projectState.js";

const seekPosInput = document.querySelector("#video-control-seek-pos");
seekPosInput.addEventListener("click", () => {
	seekPosInput.select();
})
seekPosInput.addEventListener("change", () => {
	seekPosInput.blur();
	projectState.videoSeekPos =
		FrameTime.fromString(seekPosInput.value) ??
		projectState.videoSeekPos;
	updateSeekPosInput();
});

function updateSeekPosInput() {
	seekPosInput.value = projectState.videoSeekPos.toFormattedString();
	seekPosInput.style.fontSize = Math.max(1 / Math.sqrt(seekPosInput.value.length * .3), .5) + "rem"
}
updateSeekPosInput();