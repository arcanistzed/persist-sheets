import PersistSheets from "./persist.js";

export default function registerSettings() {
    game.settings.registerMenu(PersistSheets.ID, "reset", {
        name: game.i18n.localize("persist-sheets.settings.reset.name"),
        label: game.i18n.localize("persist-sheets.settings.reset.label"),
        hint: game.i18n.localize("persist-sheets.settings.reset.hint"),
        icon: "fas fa-eraser",
        type: class extends FormApplication {
            constructor(...args) {
                super(...args);
                game.settings.set(PersistSheets.ID, "sheetStorage", {});
                ui.notifications.info(`${PersistSheets.ID} | ${game.i18n.localize("persist-sheets.settings.reset.success")}`);
            }
        },
    });

    game.settings.register(PersistSheets.ID, "sheetStorage", {
        scope: "client",
        config: false,
        type: Object,
    });

    game.settings.register(PersistSheets.ID, "restoreOpened", {
        name: game.i18n.localize("persist-sheets.settings.restoreOpened.name"),
        hint: game.i18n.localize("persist-sheets.settings.restoreOpened.hint"),
        scope: "client",
        config: true,
        type: Boolean,
        default: true,
    });
    game.settings.register(PersistSheets.ID, "keepClosedSheets", {
        name: game.i18n.localize("persist-sheets.settings.keepClosedSheets.name"),
        hint: game.i18n.localize("persist-sheets.settings.keepClosedSheets.hint"),
        scope: "client",
        config: true,
        type: Boolean,
        default: false,
    });
}
