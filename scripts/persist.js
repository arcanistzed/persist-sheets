import registerSettings from "./settings.js";

/**
 * @class PersistSheets
 */
export default class PersistSheets {
	constructor() {
		Hooks.on("init", () => {
			// Register settings
			registerSettings();

			// Add the module's API
			game.modules.get(PersistSheets.ID).api = PersistSheets;
		});

		// Register for DevMode
		Hooks.once("devModeReady", ({ registerPackageDebugFlag }) => {
			registerPackageDebugFlag(PersistSheets.ID);
		});

		// Restore the opened sheets
		Hooks.on("ready", () => {
			if (game.settings.get(PersistSheets.ID, "restoreOpened")) this.restoreOpened();
		});

		// Restore the sheet positions
		const restorePosition = app => this.restorePosition(app);
		Hooks.on("renderDocumentSheet", restorePosition);
		Hooks.on("renderActorSheet", restorePosition);
		Hooks.on("renderItemSheet", restorePosition);
	}

	/** The module's ID */
	static ID = "persist-sheets";

	/**
	 * DevMode logging helper
	 * @param {boolean} force - Whether to force logging
	 * @param {*} args - Arguments to log
	 */
	log(force, ...args) {
		const shouldLog = force || game.modules.get("_dev-mode")?.api?.getPackageDebugValue(PersistSheets.ID);
		if (shouldLog) {
			console.log(PersistSheets.ID, "|", ...args);
		}
	}

	/** Restore the opened sheets */
	restoreOpened() {
		Object.entries(game.settings.get(PersistSheets.ID, "sheetStorage")).forEach(([id, { object, position }]) => {
			this.log(false, "Restoring opened sheet", id, object, position);
			if (object) {
				fromUuid(object).then(d => {
					d.sheet.render(true, position);
				});
			}
		});
	}

	/**
	 * Restore the sheet positions
	 * @param {DocumentSheet} sheet
	 */
	restorePosition(sheet) {
		Object.entries(game.settings.get(PersistSheets.ID, "sheetStorage")).forEach(([id, { object, position }]) => {
			this.log(false, "Restoring sheet position", id, object, position);
			Object.values(ui.windows)
				.filter(w => w.id === id)
				.forEach(w => w.setPosition(position));
		});

		const debouncedSave = debounce(() => this.save(sheet), 500);
		sheet.setPosition = (...args) => {
			debouncedSave();
			sheet.constructor.prototype.setPosition.apply(sheet, args);
		};
		sheet.close = (...args) => {
			if (!game.settings.get(PersistSheets.ID, "keepClosedSheets")) this.delete(sheet);
			sheet.constructor.prototype.close.apply(sheet, args);
		};

		this.save(sheet);
	}

	/**
	 * Save a sheet's position
	 * @param {DocumentSheet} sheet
	 */
	save(sheet) {
		this.log(false, "Saving sheet position", sheet.id, sheet.position);

		game.settings.set(PersistSheets.ID, "sheetStorage", {
			...game.settings.get(PersistSheets.ID, "sheetStorage"),
			[sheet.id]: {
				object: sheet.document?.uuid,
				position: sheet.position,
			},
		});
	}

	/**
	 * Delete a sheet's position
	 * @param {DocumentSheet} sheet
	 */
	delete(sheet) {
		this.log(false, "Deleting sheet position", sheet.id);

		const sheets = game.settings.get(PersistSheets.ID, "sheetStorage");
		delete sheets[sheet.id];
		game.settings.set(PersistSheets.ID, "sheetStorage", sheets);
	}
}

new PersistSheets();
