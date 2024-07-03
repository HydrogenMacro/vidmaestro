import projectState from "../projectState.js";

const seekPosInput = document.querySelector("#video-control-seek-pos");
let currentSeekPos = [0, 0];
seekPosInput.addEventListener("click", () => {
	seekPosInput.select();
})
seekPosInput.addEventListener("change", () => {
	seekPosInput.blur();
	if (!Number.isNaN(+seekPosInput.value)) {
		currentSeekPos = secsToFrameTime(seekPosInput.value);
	}
	console.log(currentSeekPos)
	updateSeekPosInput();
});

function updateSeekPosInput() {
	seekPosInput.value = `${currentSeekPos[0]} ${currentSeekPos[1]}/${projectState.fps}`;
	seekPosInput.style.fontSize = Math.max(1 / Math.sqrt(seekPosInput.value.length * .35), .5) + "rem"
}
updateSeekPosInput();