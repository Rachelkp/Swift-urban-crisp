import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { n as safeVideo, t as safeImage } from "./media-url-DRQGMs-5.mjs";
import { a as Play, d as ChevronRight, f as ChevronLeft, n as Volume2, o as Pause, t as VolumeX, u as Clapperboard } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/resolve-x-BmF1ifbm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SiteHeader() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "flex min-h-11 items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-9 place-items-center rounded-full bg-accent text-ink",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clapperboard, {
						className: "size-4",
						"aria-hidden": "true"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-lg font-semibold",
					children: "ซีนลิงก์"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "โปรโมทจากลิงก์ X"
			})]
		})
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function clock(seconds) {
	if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
	const total = Math.round(seconds);
	return `${Math.floor(total / 60)}:${(total % 60).toString().padStart(2, "0")}`;
}
function PromoStage({ kind, videoUrl, poster, photos, headline, subline, badge, aspect, loop, autoPlay = false, durationHint = null }) {
	const videoRef = (0, import_react.useRef)(null);
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [muted, setMuted] = (0, import_react.useState)(true);
	const [time, setTime] = (0, import_react.useState)(0);
	const [duration, setDuration] = (0, import_react.useState)(durationHint ?? 0);
	const [failed, setFailed] = (0, import_react.useState)(false);
	const [photoIndex, setPhotoIndex] = (0, import_react.useState)(0);
	const playable = safeVideo(videoUrl);
	const still = safeImage(poster);
	const gallery = photos.map((photo) => safeImage(photo)).filter((photo) => photo !== null);
	(0, import_react.useEffect)(() => {
		setPlaying(false);
		setFailed(false);
		setTime(0);
		setDuration(durationHint ?? 0);
		setPhotoIndex(0);
	}, [
		playable,
		durationHint,
		gallery.length
	]);
	(0, import_react.useEffect)(() => {
		const el = videoRef.current;
		if (!el || !autoPlay || !playable) return;
		el.muted = true;
		el.play().then(() => setPlaying(true), () => setPlaying(false));
	}, [autoPlay, playable]);
	function toggle() {
		const el = videoRef.current;
		if (!el) return;
		if (el.paused) el.play().then(() => setPlaying(true), () => setFailed(true));
		else {
			el.pause();
			setPlaying(false);
		}
	}
	function seek(event) {
		const el = videoRef.current;
		if (!el || !el.duration) return;
		const rect = event.currentTarget.getBoundingClientRect();
		el.currentTime = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)) * el.duration;
	}
	function nudge(event) {
		const el = videoRef.current;
		if (!el) return;
		if (event.key === "ArrowRight") el.currentTime = Math.min(el.duration || 0, el.currentTime + 2);
		if (event.key === "ArrowLeft") el.currentTime = Math.max(0, el.currentTime - 2);
	}
	const progress = duration > 0 ? Math.min(100, time / duration * 100) : 0;
	const frame = cn("relative overflow-hidden rounded-3xl bg-raised", aspect === "wide" && "frame-wide", aspect === "story" && "frame-story", aspect === "square" && "frame-square");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("mx-auto w-full", aspect === "story" && "max-w-sm", aspect === "square" && "max-w-md"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: frame,
			children: [
				kind === "video" && playable && !failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					ref: videoRef,
					className: "h-full w-full object-cover",
					src: playable,
					poster: still ?? void 0,
					playsInline: true,
					loop,
					muted,
					preload: "metadata",
					onPlay: () => setPlaying(true),
					onPause: () => setPlaying(false),
					onEnded: () => setPlaying(false),
					onError: () => setFailed(true),
					onLoadedMetadata: (event) => setDuration(event.currentTarget.duration || durationHint || 0),
					onTimeUpdate: (event) => setTime(event.currentTarget.currentTime)
				}) : null,
				kind === "photo" && gallery.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: gallery[photoIndex] ?? gallery[0],
					alt: "",
					className: "h-full w-full object-cover",
					referrerPolicy: "no-referrer"
				}) : null,
				kind !== "photo" && kind !== "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-full flex-col justify-end bg-surface p-6",
					children: [
						badge ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-fit rounded-full bg-accent px-3 py-1 text-sm font-medium text-ink",
							children: badge
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-2xl text-fg",
							children: headline
						}),
						subline ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: subline
						}) : null
					]
				}) : null,
				kind === "video" && failed || kind === "video" && !playable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: still ?? void 0,
					alt: "",
					className: "h-full w-full object-cover",
					referrerPolicy: "no-referrer"
				}) : null,
				kind !== "text" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg via-bg/80 to-transparent px-5 pt-16 pb-5",
					children: [
						badge ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-flex rounded-full bg-accent px-3 py-1 text-sm font-medium text-ink",
							children: badge
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-2xl text-fg",
							children: headline
						}),
						subline ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: subline
						}) : null
					]
				}) : null,
				kind === "video" && playable && !failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "absolute inset-0 z-10 grid place-items-center",
					onClick: toggle,
					"aria-label": playing ? "หยุด" : "เล่นวิดีโอ",
					children: !playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-16 place-items-center rounded-full bg-accent text-ink",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
							className: "size-7 translate-x-0.5",
							"aria-hidden": "true"
						})
					}) : null
				}) : null,
				kind === "photo" && gallery.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "ภาพก่อนหน้า",
					className: "absolute top-1/2 left-3 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-bg text-fg",
					onClick: () => setPhotoIndex((index) => (index - 1 + gallery.length) % gallery.length),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
						className: "size-5",
						"aria-hidden": "true"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "ภาพถัดไป",
					className: "absolute top-1/2 right-3 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-bg text-fg",
					onClick: () => setPhotoIndex((index) => (index + 1) % gallery.length),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
						className: "size-5",
						"aria-hidden": "true"
					})
				})] }) : null
			]
		}), kind === "video" && playable && !failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "grid size-11 place-items-center rounded-full bg-raised text-fg",
					onClick: toggle,
					"aria-label": playing ? "หยุด" : "เล่น",
					children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "relative h-11 flex-1",
					onClick: seek,
					onKeyDown: nudge,
					role: "slider",
					"aria-label": "ตำแหน่งวิดีโอ",
					"aria-valuemin": 0,
					"aria-valuemax": Math.round(duration || 0),
					"aria-valuenow": Math.round(time),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute top-1/2 right-0 left-0 h-1 -translate-y-1/2 rounded-full bg-line",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block h-full rounded-full bg-accent",
							style: { width: `${progress}%` }
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "w-16 text-right text-sm text-muted tabular-nums",
					children: [
						clock(time),
						"/",
						clock(duration || durationHint || 0)
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "grid size-11 place-items-center rounded-full bg-raised text-fg",
					onClick: () => setMuted((value) => !value),
					"aria-label": muted ? "เปิดเสียง" : "ปิดเสียง",
					children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" })
				})
			]
		}) : null]
	});
}
var buttonVariants = cva("inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-40", {
	variants: { variant: {
		primary: "bg-accent text-ink hover:bg-accent/90",
		quiet: "bg-raised text-fg hover:bg-line",
		line: "border border-line bg-transparent text-fg hover:bg-raised",
		ghost: "bg-transparent text-muted hover:bg-raised hover:text-fg"
	} },
	defaultVariants: { variant: "primary" }
});
function Button({ className, variant, asChild = false, type = "button", ...props }) {
	if (asChild) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slot, {
		className: cn(buttonVariants({ variant }), className),
		...props
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn(buttonVariants({ variant }), className),
		...props
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function asRecord(value) {
	if (!value || typeof value !== "object") return null;
	return value;
}
var resolveXLink = createServerFn({ method: "POST" }).validator((input) => {
	const record = asRecord(input);
	const url = typeof record?.url === "string" ? record.url.trim() : "";
	if (url.length < 2 || url.length > 500) throw new Error("ใส่ลิงก์โพสต์จาก X หรือ Twitter");
	return { url };
}).handler(createSsrRpc("f0d6d42f5eb965ed1deb5c28bc7bea9795ca5d9ef0ba112fec0fd42b98129583"));
//#endregion
export { resolveXLink as i, PromoStage as n, SiteHeader as r, Button as t };
