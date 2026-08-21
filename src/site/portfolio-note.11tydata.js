require("dotenv").config();
const settings = require("../helpers/constants");

const allSettings = settings.ALL_NOTE_SETTINGS;

function computeSettings(data) {
  const noteSettings = {};
  allSettings.forEach((setting) => {
    const noteSetting = data[setting];
    const globalSetting = process.env[setting];
    noteSettings[setting] =
      noteSetting || (globalSetting === "true" && noteSetting !== false);
  });
  return noteSettings;
}

module.exports = {
  pagination: {
    data: "collections.portfolio",
    size: 1,
    alias: "note",
  },
  permalink: (data) => {
    const url = data.note && data.note.url;
    if (!url || url === "/") return false;
    return "/portfolio" + url;
  },
  eleventyComputed: {
    title: (data) => data.note && data.note.data.title,
    tags: (data) => data.note && data.note.data.tags,
    noteIcon: (data) => data.note && data.note.data.noteIcon,
    created: (data) => data.note && data.note.data.created,
    updated: (data) => data.note && data.note.data.updated,
    "dg-note-properties": (data) => {
      const props =
        (data.note && data.note.data["dg-note-properties"]) || {};
      return Object.assign({}, props, { dgShowComments: false });
    },
    settings: (data) => {
      const noteSettings = computeSettings(data.note ? data.note.data : data);
      noteSettings.dgShowComments = false;
      return noteSettings;
    },
  },
};
