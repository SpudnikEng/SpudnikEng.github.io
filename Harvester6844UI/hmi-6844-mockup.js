(function () {
	"use strict";

	function initTabs() {
		const tabs = Array.from(document.querySelectorAll(".hmi-nav [role='tab']"));
		const panels = Array.from(document.querySelectorAll(".hmi-panel"));

		function activate(id) {
			tabs.forEach((t) => {
				const sel = t.getAttribute("aria-controls") === id;
				t.setAttribute("aria-selected", sel ? "true" : "false");
				t.tabIndex = sel ? 0 : -1;
			});
			panels.forEach((p) => {
				const match = p.id === id;
				p.hidden = !match;
				p.classList.toggle("hmi-panel--active", match);
			});
		}

		tabs.forEach((tab) => {
			tab.addEventListener("click", () => {
				const id = tab.getAttribute("aria-controls");
				if (id) activate(id);
			});
			tab.addEventListener("keydown", (e) => {
				const i = tabs.indexOf(document.activeElement);
				if (e.key === "ArrowDown" || e.key === "ArrowRight") {
					e.preventDefault();
					const n = (i + 1) % tabs.length;
					tabs[n].focus();
					activate(tabs[n].getAttribute("aria-controls"));
				} else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
					e.preventDefault();
					const n = (i - 1 + tabs.length) % tabs.length;
					tabs[n].focus();
					activate(tabs[n].getAttribute("aria-controls"));
				}
			});
		});

		const first = tabs.find((t) => t.getAttribute("aria-selected") === "true");
		if (first) activate(first.getAttribute("aria-controls"));
	}

	function initRun() {
		const btn = document.getElementById("hmi-run");
		if (!btn) return;
		btn.addEventListener("click", () => {
			const on = btn.getAttribute("data-state") !== "on";
			btn.setAttribute("data-state", on ? "on" : "off");
			btn.setAttribute("aria-pressed", on ? "true" : "false");
		});
	}

	document.addEventListener("DOMContentLoaded", () => {
		if (typeof applyMachineConfig === "function") applyMachineConfig();
		initTabs();
		initRun();
	});
})();
