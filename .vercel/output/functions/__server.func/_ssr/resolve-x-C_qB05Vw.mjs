import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { n as safeVideo, t as safeImage } from "./media-url-DRQGMs-5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/resolve-x-C_qB05Vw.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var cache = /* @__PURE__ */ new Map();
var TTL_MS = 6e5;
function asRecord(value) {
	if (!value || typeof value !== "object") return null;
	return value;
}
function count(value) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Number(value);
	return 0;
}
function statusIdFrom(value) {
	const match = value.match(/status\/(\d{6,22})/);
	if (match?.[1]) return match[1];
	const trimmed = value.trim();
	return /^\d{6,22}$/.test(trimmed) ? trimmed : null;
}
function allowedHost(hostname) {
	const host = hostname.replace(/^www\./, "");
	return host === "t.co" || host === "x.com" || host === "twitter.com" || host === "mobile.x.com" || host === "mobile.twitter.com";
}
async function resolveShortLink(rawUrl) {
	let current = rawUrl;
	for (let hop = 0; hop < 4; hop += 1) {
		const response = await fetch(current, {
			redirect: "manual",
			signal: AbortSignal.timeout(8e3),
			headers: { "user-agent": "SeenlinkPromo/1.0" }
		});
		if (response.status >= 300 && response.status < 400) {
			const location = response.headers.get("location");
			if (!location) return null;
			const next = new URL(location, current);
			if (!allowedHost(next.hostname)) return null;
			const id = statusIdFrom(next.href);
			if (id) return id;
			current = next.toString();
			continue;
		}
		return statusIdFrom(response.url);
	}
	return null;
}
async function findStatusId(raw) {
	const direct = statusIdFrom(raw);
	if (direct) return { id: direct };
	let parsed;
	try {
		parsed = new URL(raw.includes("://") ? raw : `https://${raw}`);
	} catch {
		return { message: "ลิงก์นี้ใช้ไม่ได้" };
	}
	if (parsed.hostname.replace(/^www\./, "") !== "t.co") return { message: "ไม่พบเลขโพสต์ ใช้ลิงก์ที่มี /status/ ตามด้วยตัวเลข" };
	try {
		const id = await resolveShortLink(parsed.toString());
		if (!id) return { message: "ลิงก์สั้นนี้ไม่ได้ชี้ไปที่โพสต์" };
		return { id };
	} catch {
		return { message: "เปิดลิงก์สั้นไม่สำเร็จ" };
	}
}
function bestMp4(item) {
	const formats = Array.isArray(item.formats) ? item.formats : [];
	const mp4s = [];
	for (const format of formats) {
		const record = asRecord(format);
		if (!record) continue;
		const url = safeVideo(typeof record.url === "string" ? record.url : null);
		if (!url || !url.includes(".mp4")) continue;
		if (record.container && record.container !== "mp4") continue;
		mp4s.push({
			url,
			bitrate: typeof record.bitrate === "number" ? record.bitrate : 0
		});
	}
	if (mp4s.length > 0) {
		const sorted = [...mp4s].sort((a, b) => a.bitrate - b.bitrate);
		return (sorted.find((file) => file.bitrate >= 7e5 && file.bitrate <= 25e5) ?? sorted[sorted.length - 1]).url;
	}
	const direct = safeVideo(typeof item.url === "string" ? item.url : null);
	return direct && direct.includes(".mp4") ? direct : null;
}
function mediaItems(media) {
	if (!media) return [];
	if (Array.isArray(media.all) && media.all.length > 0) return media.all.map(asRecord).filter((item) => item !== null);
	const videos = Array.isArray(media.videos) ? media.videos : [];
	const photos = Array.isArray(media.photos) ? media.photos : [];
	return [...videos, ...photos].map(asRecord).filter((item) => item !== null);
}
function tweetText(tweet) {
	if (typeof tweet.text === "string" && tweet.text.trim()) return tweet.text.trim();
	const raw = asRecord(tweet.raw_text);
	if (raw && typeof raw.text === "string" && raw.text.trim()) return raw.text.trim();
	const quote = asRecord(tweet.quote);
	if (quote) return tweetText(quote);
	return "";
}
function canonicalUrl(url, handle, id) {
	if (typeof url === "string") try {
		const parsed = new URL(url);
		const host = parsed.hostname.replace(/^www\./, "");
		if (parsed.protocol === "https:" && (host === "x.com" || host === "twitter.com")) return parsed.toString();
	} catch {}
	return `https://x.com/${handle}/status/${id}`;
}
function mapTweet(tweet, fallbackId) {
	const author = asRecord(tweet.author);
	const handle = typeof author?.screen_name === "string" && author.screen_name ? author.screen_name : "i";
	const id = typeof tweet.id === "string" && tweet.id ? tweet.id : fallbackId;
	const sources = [tweet, asRecord(tweet.quote)].filter((item) => item !== null);
	let videoUrl = null;
	let poster = null;
	let width = null;
	let height = null;
	let duration = null;
	const photos = [];
	for (const source of sources) {
		for (const item of mediaItems(asRecord(source.media))) {
			const type = typeof item.type === "string" ? item.type : "";
			if (!videoUrl && (type === "video" || type === "gif")) {
				const mp4 = bestMp4(item);
				if (mp4) {
					videoUrl = mp4;
					poster = safeImage(typeof item.thumbnail_url === "string" ? item.thumbnail_url : null);
					width = typeof item.width === "number" ? item.width : null;
					height = typeof item.height === "number" ? item.height : null;
					duration = typeof item.duration === "number" ? item.duration : null;
				}
			}
			if (type === "photo" || type === "image") {
				const photo = safeImage(typeof item.url === "string" ? item.url : null);
				if (photo && !photos.includes(photo)) photos.push(photo);
			}
		}
		if (videoUrl) break;
	}
	const views = count(tweet.views);
	const kind = videoUrl ? "video" : photos.length > 0 ? "photo" : "text";
	return {
		id,
		url: canonicalUrl(tweet.url, handle, id),
		text: tweetText(tweet),
		createdAt: typeof tweet.created_at === "string" ? tweet.created_at : "",
		authorName: typeof author?.name === "string" && author.name ? author.name : handle,
		handle,
		avatar: safeImage(typeof author?.avatar_url === "string" ? author.avatar_url : null),
		likes: count(tweet.likes),
		reposts: count(tweet.retweets),
		replies: count(tweet.replies),
		views: views > 0 ? views : null,
		kind,
		videoUrl,
		poster: poster ?? photos[0] ?? null,
		width,
		height,
		duration,
		photos: photos.slice(0, 4)
	};
}
async function fetchPost(id) {
	const hit = cache.get(id);
	if (hit && Date.now() - hit.at < TTL_MS) return {
		ok: true,
		post: hit.post
	};
	let payload = null;
	for (let attempt = 0; attempt < 2; attempt += 1) try {
		const response = await fetch(`https://api.fxtwitter.com/status/${id}`, {
			headers: {
				accept: "application/json",
				"user-agent": "SeenlinkPromo/1.0"
			},
			signal: AbortSignal.timeout(12e3)
		});
		if (response.status === 404) return {
			ok: false,
			message: "ไม่พบโพสต์นี้ อาจถูกลบหรือเป็นบัญชีส่วนตัว"
		};
		if (!response.ok) continue;
		payload = await response.json();
		break;
	} catch {
		payload = null;
	}
	const root = asRecord(payload);
	const tweet = asRecord(root?.tweet);
	if (!root || root.code !== 200 || !tweet) {
		const message = typeof root?.message === "string" ? root.message : "";
		if (/private|protected/i.test(message)) return {
			ok: false,
			message: "โพสต์นี้เป็นบัญชีส่วนตัว ใช้ได้เฉพาะโพสต์สาธารณะ"
		};
		return {
			ok: false,
			message: "ดึงโพสต์ไม่สำเร็จ ตรวจลิงก์หรือลองใหม่อีกครั้ง"
		};
	}
	const post = mapTweet(tweet, id);
	cache.set(id, {
		at: Date.now(),
		post
	});
	return {
		ok: true,
		post
	};
}
var resolveXLink_createServerFn_handler = createServerRpc({
	id: "f0d6d42f5eb965ed1deb5c28bc7bea9795ca5d9ef0ba112fec0fd42b98129583",
	name: "resolveXLink",
	filename: "src/lib/resolve-x.ts"
}, (opts) => resolveXLink.__executeServer(opts));
var resolveXLink = createServerFn({ method: "POST" }).validator((input) => {
	const record = asRecord(input);
	const url = typeof record?.url === "string" ? record.url.trim() : "";
	if (url.length < 2 || url.length > 500) throw new Error("ใส่ลิงก์โพสต์จาก X หรือ Twitter");
	return { url };
}).handler(resolveXLink_createServerFn_handler, async ({ data }) => {
	const found = await findStatusId(data.url);
	if ("message" in found) return {
		ok: false,
		message: found.message
	};
	return fetchPost(found.id);
});
//#endregion
export { resolveXLink_createServerFn_handler };
