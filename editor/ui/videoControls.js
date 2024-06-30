import projectState from "../projectState.js";

const seekPosInput = document.querySelector("#video-control-seek-pos");
let currentSeekPos = [0, 0];
seekPosInput.addEventListener("click", () => {
	seekPosInput.select();
})
seekPosInput.addEventListener("change", () => {
	seekPosInput.blur();
	if (!Number.isNaN(+seekPosInput.value)) {
		currentSeekPos = secsToSeekPos(seekPosInput.value);
	}
	console.log(currentSeekPos)
	updateSeekPosInput();
})
function secsToSeekPos(secs) {
	return [
		Math.floor(secs),
		Math.round((secs - Math.floor(secs)) * projectState.fps)
	];
}
function updateSeekPosInput() {
	seekPosInput.value = `${currentSeekPos[0]} ${currentSeekPos[1]}/${projectState.fps}`;
}