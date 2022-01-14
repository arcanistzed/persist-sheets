import PersistSheets from "./persist.js";

export default function registerSettings() {
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
}
