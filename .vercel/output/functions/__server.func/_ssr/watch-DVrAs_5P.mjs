import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as suggestHeadline, n as Route } from "./router-CGtEdF-r.mjs";
import { i as resolveXLink, n as PromoStage, r as SiteHeader, t as Button } from "./resolve-x-BmF1ifbm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/watch-DVrAs_5P.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WatchPage() {
	const search = Route.useSearch();
	const [post, setPost] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!search.u) return;
		let cancel = false;
		setBusy(true);
		setError("");
		resolveXLink({ data: { url: search.u } }).then((result) => {
			if (cancel) return;
			if (!result.ok) {
				setPost(null);
				setError(result.message);
				return;
			}
			setPost(result.post);
		}).catch(() => {
			if (!cancel) setError("เปิดโปรโมทนี้ไม่สำเร็จ");
		}).finally(() => {
			if (!cancel) setBusy(false);
		});
		return () => {
			cancel = true;
		};
	}, [search.u]);
	const headline = search.h || (post ? suggestHeadline(post.text, post.handle) : "");
	const subline = search.s || (post ? `@${post.handle}` : "");
	const cta = search.c || "ดูบน X";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto flex max-w-3xl flex-col px-4 pt-6 pb-16",
			children: [
				!search.u ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-16 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-3xl",
							children: "ยังไม่มีลิงก์โปรโมท"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-muted",
							children: "กลับไปวางลิงก์จาก X เพื่อสร้างหน้านี้"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "mt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								children: "ไปที่สตูดิโอ"
							})
						})
					]
				}) : null,
				search.u && busy && !post ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-16 text-center text-muted",
					children: "กำลังเปิดโปรโมท…"
				}) : null,
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-10 text-center",
					children: error
				}) : null,
				post ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromoStage, {
						kind: post.kind,
						videoUrl: post.videoUrl,
						poster: post.poster,
						photos: post.photos,
						headline,
						subline,
						badge: search.b,
						aspect: search.a,
						loop: search.l,
						autoPlay: true,
						durationHint: post.duration
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex flex-col gap-2 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "sm:flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: post.url,
								target: "_blank",
								rel: "noreferrer",
								children: cta
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "line",
							className: "sm:flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								search: { u: post.url },
								children: "แต่งโปรโมทนี้ต่อ"
							})
						})]
					}),
					post.text ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-sm leading-relaxed text-muted",
						children: post.text
					}) : null
				] }) : null
			]
		})]
	});
}
//#endregion
export { WatchPage as component };
