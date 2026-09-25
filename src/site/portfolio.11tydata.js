require("dotenv").config();
const settings = require("../helpers/constants");
const pluginLoader = require("../helpers/pluginLoader");

// Core note settings plus any per-note flags declared by enabled plugins
// (manifest "noteSettings"), matching notes.11tydata.js. Without this the
// portfolio page wouldn't see plugin-owned flags and would drop the filetree,
// search and link-preview UI.
const allSettings = [
  ...settings.ALL_NOTE_SETTINGS,
  ...pluginLoader.getNoteSettingKeys(),
];

module.exports = {
  eleventyComputed: {
    settings: (data) => {
      const noteSettings = {};
      allSettings.forEach((setting) => {
        let noteSetting = data[setting];
        let globalSetting = process.env[setting];

        let settingValue =
          noteSetting || (globalSetting === "true" && noteSetting !== false);
        noteSettings[setting] = settingValue;
      });
      return noteSettings;
    },
  },
};
