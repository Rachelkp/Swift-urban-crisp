import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as useNavigate, x as useRouter, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as safeImage } from "./media-url-DRQGMs-5.mjs";
import { a as Play, c as ExternalLink, i as Trash2, l as Copy, p as Check, s as LoaderCircle } from "../_libs/lucide-react.mjs";
import { a as loadShelf, c as suggestHeadline, i as clip, o as saveShelf, r as Route$1, s as suggestAspect } from "./router-CGtEdF-r.mjs";
import { i as resolveXLink, n as PromoStage, r as SiteHeader, t as Button } from "./resolve-x-BmF1ifbm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BsiHiEAw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SAMPLE = "https://x.com/NASASpaceflight/status/2107823511930593687";
var SAMPLE_POSTER = "https://pbs.twimg.com/amplify_video_thumb/2107823426903621632/img/nrjSsE2frt_m2Upj.jpg";
var BADGES = [
	"ใหม่",
	"ไวรัล",
	"เบื้องหลัง",
	"รอบปฐมทัศน์"
];
var ASPECTS = [
	{
		id: "wide",
		label: "กว้าง"
	},
	{
		id: "story",
		label: "สตอรี่"
	},
	{
		id: "square",
		label: "จัตุรัส"
	}
];
var fieldClass = "min-h-12 w-full rounded-2xl border border-line bg-bg px-4 text-base text-fg outline-none placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
function compact(value) {
	return new Intl.NumberFormat("th-TH", {
		notation: "compact",
		maximumFractionDigits: 1
	}).format(value);
}
function formatWhen(value) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	return new Intl.DateTimeFormat("th-TH", {
		day: "numeric",
		month: "short",
		year: "numeric"
	}).format(date);
}
var STEPS = [
	{
		n: "1",
		title: "วางลิงก์โพสต์",
		body: "ใช้ลิงก์จาก x.com หรือ twitter.com ที่เป็นโพสต์สาธารณะ"
	},
	{
		n: "2",
		title: "แต่งคำโปรโมท",
		body: "ใส่หัวข้อ ป้าย และปุ่ม ให้คลิปพร้อมส่งต่อ"
	},
	{
		n: "3",
		title: "แชร์หน้าเดียว",
		body: "เปิดหน้าโปรโมทที่เล่นวิดีโอได้โดยไม่ต้องฝังทวีต"
	}
];
function StudioApp({ initialUrl }) {
	const navigate = useNavigate();
	const router = useRouter();
	const [input, setInput] = (0, import_react.useState)(initialUrl);
	const [post, setPost] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [fallbackUrl, setFallbackUrl] = (0, import_react.useState)("");
	const [headline, setHeadline] = (0, import_react.useState)("");
	const [subline, setSubline] = (0, import_react.useState)("");
	const [badge, setBadge] = (0, import_react.useState)("");
	const [cta, setCta] = (0, import_react.useState)("ดูบน X");
	const [aspect, setAspect] = (0, import_react.useState)("wide");
	const [loop, setLoop] = (0, import_react.useState)(true);
	const [shelf, setShelf] = (0, import_react.useState)([]);
	const [shelfReady, setShelfReady] = (0, import_react.useState)(false);
	const [posterOk, setPosterOk] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		setShelf(loadShelf());
		setShelfReady(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!shelfReady) return;
		saveShelf(shelf);
	}, [shelf, shelfReady]);
	(0, import_react.useEffect)(() => {
		if (!initialUrl) return;
		let cancel = false;
		setInput(initialUrl);
		load(initialUrl, void 0, () => cancel);
		return () => {
			cancel = true;
		};
	}, [initialUrl]);
	async function load(url, preset, isCancelled) {
		setBusy(true);
		setError("");
		setNote("");
		setFallbackUrl("");
		try {
			const result = await resolveXLink({ data: { url } });
			if (isCancelled?.()) return;
			if (!result.ok) {
				setError(result.message);
				return;
			}
			const next = result.post;
			setPost(next);
			setHeadline(preset?.headline ?? suggestHeadline(next.text, next.handle));
			setSubline(preset?.subline ?? `@${next.handle}`);
			setBadge(preset?.badge ?? "");
			setCta(preset?.cta || "ดูบน X");
			setAspect(preset?.aspect ?? suggestAspect(next.width, next.height));
			setLoop(preset?.loop ?? true);
		} catch {
			if (!isCancelled?.()) setError("ดึงโพสต์ไม่สำเร็จ ลองใหม่อีกครั้ง");
		} finally {
			if (!isCancelled?.()) setBusy(false);
		}
	}
	function go(url) {
		const next = url.trim();
		if (!next) {
			setError("วางลิงก์โพสต์ก่อน");
			return;
		}
		if (next === initialUrl) {
			load(next);
			return;
		}
		navigate({
			to: "/",
			search: { u: next }
		});
	}
	function onSubmit(event) {
		event.preventDefault();
		go(input);
	}
	function watchSearch() {
		return {
			u: post?.url ?? "",
			h: clip(headline, 80),
			s: clip(subline, 140),
			b: clip(badge, 24),
			c: clip(cta, 32),
			a: aspect,
			l: loop
		};
	}
	async function copyLink() {
		if (!post) return;
		const href = router.buildLocation({
			to: "/watch",
			search: watchSearch()
		}).href;
		const absolute = new URL(href, window.location.href).toString();
		try {
			await navigator.clipboard.writeText(absolute);
			setFallbackUrl("");
			setNote("คัดลอกลิงก์โปรโมทแล้ว");
		} catch {
			setFallbackUrl(absolute);
			setNote("คัดลอกอัตโนมัติไม่ได้ ลากเลือกลิงก์ด้านล่าง");
		}
	}
	function keep() {
		if (!post) return;
		const campaign = {
			id: crypto.randomUUID(),
			sourceUrl: post.url,
			headline: clip(headline, 80),
			subline: clip(subline, 140),
			badge: clip(badge, 24),
			cta: clip(cta, 32) || "ดูบน X",
			aspect,
			loop,
			savedAt: Date.now(),
			handle: post.handle,
			authorName: post.authorName,
			poster: post.poster,
			kind: post.kind
		};
		setShelf((list) => [campaign, ...list.filter((item) => item.sourceUrl !== post.url)].slice(0, 12));
		setNote("เก็บไว้บนชั้นวางของเบราว์เซอร์นี้แล้ว");
	}
	const when = post ? formatWhen(post.createdAt) : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 pt-8 pb-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-accent",
					children: "สตูดิโอโปรโมทคลิป"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 max-w-3xl text-4xl sm:text-5xl",
					children: post ? "เฟรมนี้พร้อมแชร์" : "วางลิงก์จาก X แล้วได้หน้าโปรโมท"
				}),
				!post ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-2xl text-base leading-relaxed text-muted",
					children: "ดึงวิดีโอจากโพสต์บน X หรือ Twitter มาใส่หัวข้อ ป้าย และปุ่ม แล้วเปิดเป็นหน้าโปรโมทที่เล่นคลิปได้เลย ไม่ต้องฝังกล่องทวีต"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					className: "mt-6 rounded-3xl border border-line bg-surface p-3 sm:p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "x-link",
							className: "px-2 text-sm font-medium",
							children: "ลิงก์โพสต์"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex flex-col gap-2 sm:flex-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "x-link",
								name: "url",
								value: input,
								onChange: (event) => setInput(event.target.value),
								placeholder: "https://x.com/ชื่อ/status/…",
								autoCapitalize: "off",
								autoCorrect: "off",
								spellCheck: false,
								inputMode: "url",
								className: fieldClass
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								disabled: busy,
								className: "sm:min-w-32",
								children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 motion-safe:animate-spin" }) : null, "ดึงคลิป"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-2 pt-3 text-sm text-muted",
							children: "ใช้ได้กับโพสต์สาธารณะบน x.com และ twitter.com"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"aria-live": "polite",
					className: "mt-3 min-h-6 text-sm",
					children: [
						busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: "กำลังดึงคลิปจาก X…"
						}) : null,
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-fg",
							children: error
						}) : null,
						!busy && note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-accent",
							children: note
						}) : null
					]
				})
			] }),
			!post ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid items-stretch gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "grid gap-3",
					children: STEPS.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-3xl border border-line bg-surface p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-accent",
								children: step.n
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 text-xl",
								children: step.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm leading-relaxed text-muted",
								children: step.body
							})
						]
					}, step.n))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => go(SAMPLE),
					className: "group relative min-h-56 overflow-hidden rounded-3xl bg-raised text-left",
					"aria-label": "ลองคลิปตัวอย่างจาก X",
					children: [
						posterOk ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: SAMPLE_POSTER,
							alt: "",
							className: "absolute inset-0 h-full w-full object-cover",
							referrerPolicy: "no-referrer",
							onError: () => setPosterOk(false)
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute inset-0 grid place-items-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-16 place-items-center rounded-full bg-accent text-ink",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
									className: "size-7 translate-x-0.5",
									"aria-hidden": "true"
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "absolute right-5 bottom-5 left-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-flex rounded-full bg-accent px-3 py-1 text-sm font-medium text-ink",
									children: "ตัวอย่าง"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-3 block text-2xl text-fg",
									children: "คลิปจากโพสต์บน X"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 block text-sm text-muted",
									children: "แตะเพื่อดึงวิดีโอตัวอย่างเข้าสตูดิโอ"
								})
							]
						})
					]
				})]
			}) : null,
			post ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: busy ? "mt-6 grid gap-6 opacity-70 lg:grid-cols-2" : "mt-6 grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromoStage, {
						kind: post.kind,
						videoUrl: post.videoUrl,
						poster: post.poster,
						photos: post.photos,
						headline: headline || suggestHeadline(post.text, post.handle),
						subline,
						badge,
						aspect,
						loop,
						durationHint: post.duration
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center gap-3",
						children: [post.avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: post.avatar,
							alt: "",
							className: "size-11 rounded-full object-cover",
							referrerPolicy: "no-referrer"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-11 place-items-center rounded-full bg-raised text-sm text-accent",
							children: Array.from(post.authorName)[0]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-medium",
								children: post.authorName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "truncate text-sm text-muted",
								children: [
									"@",
									post.handle,
									when ? ` · ${when}` : ""
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted tabular-nums",
						children: [
							post.views != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "inline",
								children: "วิว "
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "inline text-fg",
								children: compact(post.views)
							})] }) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "inline",
								children: "ถูกใจ "
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "inline text-fg",
								children: compact(post.likes)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "inline",
								children: "รีโพสต์ "
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "inline text-fg",
								children: compact(post.reposts)
							})] })
						]
					}),
					post.kind === "photo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "โพสต์นี้ไม่มีวิดีโอ ใช้ภาพเป็นโปสเตอร์โปรโมท"
					}) : null,
					post.kind === "text" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "โพสต์นี้ไม่มีวิดีโอหรือภาพ จัดเป็นการ์ดข้อความ"
					}) : null,
					post.text ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", {
						className: "mt-4 border-l-2 border-accent pl-4 text-sm leading-relaxed text-muted",
						children: post.text
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: post.url,
						target: "_blank",
						rel: "noreferrer",
						className: "mt-3 inline-flex min-h-11 items-center gap-2 text-sm text-accent",
						children: ["เปิดโพสต์ต้นฉบับ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {
							className: "size-4",
							"aria-hidden": "true"
						})]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "grid content-start gap-4 rounded-3xl border border-line bg-surface p-4 sm:p-5",
					onSubmit: (event) => event.preventDefault(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl",
							children: "แต่งโปรโมท"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-2 text-sm font-medium",
							children: ["หัวข้อ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: headline,
								onChange: (event) => setHeadline(clip(event.target.value, 80)),
								className: fieldClass,
								maxLength: 80
							})]
						}),
						post.text ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "w-fit text-sm text-accent",
							onClick: () => setHeadline(suggestHeadline(post.text, post.handle)),
							children: "ใช้ข้อความจากโพสต์"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-2 text-sm font-medium",
							children: ["บรรทัดรอง", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: subline,
								onChange: (event) => setSubline(clip(event.target.value, 140)),
								className: fieldClass,
								maxLength: 140
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "ป้ายเล็ก"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-2",
							children: BADGES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": badge === item,
								onClick: () => setBadge((current) => current === item ? "" : item),
								className: badge === item ? "min-h-11 rounded-full bg-accent px-4 text-sm font-medium text-ink" : "min-h-11 rounded-full bg-raised px-4 text-sm text-fg",
								children: item
							}, item))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-2 text-sm font-medium",
							children: ["ข้อความปุ่ม", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: cta,
								onChange: (event) => setCta(clip(event.target.value, 32)),
								className: fieldClass,
								maxLength: 32
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							id: "aspect-label",
							children: "สัดส่วนเฟรม"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							role: "radiogroup",
							"aria-labelledby": "aspect-label",
							className: "mt-2 grid grid-cols-3 gap-2",
							children: ASPECTS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								role: "radio",
								"aria-checked": aspect === item.id,
								onClick: () => setAspect(item.id),
								className: aspect === item.id ? "min-h-11 rounded-full bg-accent text-sm font-medium text-ink" : "min-h-11 rounded-full bg-raised text-sm text-fg",
								children: item.label
							}, item.id))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"aria-pressed": loop,
							onClick: () => setLoop((value) => !value),
							className: "flex min-h-11 items-center justify-between rounded-2xl bg-raised px-4 text-sm",
							children: ["วนลูปคลิป", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: loop ? "text-accent" : "text-muted",
								children: loop ? "เปิด" : "ปิด"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									onClick: keep,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
										className: "size-4",
										"aria-hidden": "true"
									}), "เก็บบนชั้นวาง"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									variant: "quiet",
									onClick: () => void copyLink(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {
										className: "size-4",
										"aria-hidden": "true"
									}), "คัดลอกลิงก์"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "line",
									className: "sm:col-span-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/watch",
										search: watchSearch(),
										children: "เปิดหน้าโปรโมท"
									})
								})
							]
						}),
						fallbackUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							readOnly: true,
							value: fallbackUrl,
							className: fieldClass,
							onFocus: (event) => event.target.select()
						}) : null
					]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl",
						children: "ชั้นวางของฉัน"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "เก็บไว้ในเบราว์เซอร์นี้เท่านั้น ไม่ต้องสมัครบัญชี"
					}),
					shelf.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 rounded-3xl border border-line bg-surface px-4 py-8 text-sm text-muted",
						children: "ยังไม่มีโปรโมทที่เก็บไว้ ดึงคลิปแล้วกดเก็บบนชั้นวาง"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
						children: shelf.map((item) => {
							const poster = safeImage(item.poster);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "overflow-hidden rounded-3xl border border-line bg-surface",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => void load(item.sourceUrl, item),
									className: "block w-full text-left",
									children: [
										poster ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: poster,
											alt: "",
											className: "aspect-video w-full object-cover",
											referrerPolicy: "no-referrer"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "grid aspect-video w-full place-items-center bg-raised text-sm text-muted",
											children: item.kind === "text" ? "การ์ดข้อความ" : "ไม่มีภาพปก"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block px-4 pt-3 text-base font-medium",
											children: item.headline
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "block px-4 pb-3 text-sm text-muted",
											children: ["@", item.handle]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "px-3 pb-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setShelf((list) => list.filter((row) => row.id !== item.id)),
										className: "inline-flex min-h-11 items-center gap-2 px-2 text-sm text-muted",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
											className: "size-4",
											"aria-hidden": "true"
										}), "ลบ"]
									})
								})]
							}, item.id);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "mt-12 text-sm leading-relaxed text-muted",
				children: "ซีนลิงก์อ่านโพสต์สาธารณะเพื่อจัดหน้าโปรโมท ไฟล์วิดีโอยังอยู่ที่ต้นทางบน X"
			})
		]
	});
}
var SplitComponent = function Home() {
	const { u } = Route$1.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioApp, { initialUrl: u ?? "" })]
	});
};
//#endregion
export { SplitComponent as component };
