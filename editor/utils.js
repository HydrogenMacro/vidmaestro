export function showFilePicker() {
	return new Promise(res => {
		const input = document.createElement("input");
		input.type = "file";
		input.multiple = true;
		input.addEventListener("change", () => {
			res(input.files);
		});
		input.click();
	});
}
