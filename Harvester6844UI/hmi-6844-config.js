/**
 * Machine / feature flags for the 6844 HMI mockup.
 * Edit this object to adapt the UI without changing markup.
 */
window.MACHINE_CONFIG = {
	features: {
		wheelDrive: false,
		intakeChain: true,
		depthWheels: true,
		stripperKit: true,
	},
	meta: {
		model: "6844-55-26",
		version: "Version 2.08 / 1.03",
	},
};

/**
 * Toggle visibility of elements with data-requires="featureName"
 * when MACHINE_CONFIG.features[featureName] is true.
 */
function applyMachineConfig() {
	const cfg = window.MACHINE_CONFIG;
	const features = cfg.features || {};

	document.querySelectorAll("[data-requires]").forEach((el) => {
		const key = el.getAttribute("data-requires");
		if (!key) return;
		const on = features[key] === true;
		el.hidden = !on;
		el.setAttribute("aria-hidden", on ? "false" : "true");
	});

	const modelEl = document.getElementById("hmi-model");
	const verEl = document.getElementById("hmi-version");
	if (cfg.meta && modelEl) modelEl.textContent = cfg.meta.model || "";
	if (cfg.meta && verEl) verEl.textContent = cfg.meta.version || "";
}
