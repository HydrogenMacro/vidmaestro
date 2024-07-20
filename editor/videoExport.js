export function generateVideo() {
	const videoExportWorker = new Worker("./videoExportWorker.js", {
		type: "module",
	});
	videoExportWorker.postMessage(true);
	return new Promise(res => {
		videoExportWorker.onmessage = (e) => {
			videoExportWorker.terminate();
			res(e.data);
		}
	});
}