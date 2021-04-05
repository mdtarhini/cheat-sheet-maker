const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// create Schema
const SheetSchema = new Schema({
  title: { type: String, required: true },
  authorId: { type: String, required: true },
  authorUsername: { type: String, required: true },
  published: { type: Boolean, required: true, default: false },

  cells: {
    type: Array,
    default: [{ id: 0, title: "", rows: [{ id: 0, value: "", lang: "none" }] }],
  },
  theme: { type: String, required: true, default: "blue" },
  maxCols: { type: String, required: true, default: "2" },
  corners: { type: String, required: true, default: "small" },
  borders: { type: String, required: true, default: "zero" },
  defaultLang: { type: String, required: true, default: "javascript" },
  favorites: { type: Array, required: true, default: [] },
  createdAt: { type: Date, default: Date.now },
  publishedAt: { type: Date },
});
module.exports = Sheet = mongoose.model("sheet", SheetSchema);
