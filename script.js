let header = document.querySelector("header");
let firstBodyCard = document.querySelector(".body-card");
setInterval(updateHeader, 400);
function updateHeader() {
	let bodyClientRect = firstBodyCard.getBoundingClientRect();
	if (bodyClientRect.top > convertRemToPixels(4)) {
		// still looking at title card
		header.style.top = "-3.5rem";
	} else {
		header.style.top = "0";
	}
}

function convertRemToPixels(rem) { // https://stackoverflow.com/a/42769683
	return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

