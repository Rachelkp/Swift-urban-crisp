//#region node_modules/.nitro/vite/services/ssr/assets/media-url-DRQGMs-5.js
function hostOf(url) {
	try {
		const parsed = new URL(url);
		if (parsed.protocol !== "https:") return null;
		return parsed.hostname.replace(/^www\./, "");
	} catch {
		return null;
	}
}
function safeImage(url) {
	if (!url) return null;
	return hostOf(url) === "pbs.twimg.com" ? url : null;
}
function safeVideo(url) {
	if (!url) return null;
	return hostOf(url) === "video.twimg.com" ? url : null;
}
//#endregion
export { safeVideo as n, safeImage as t };
