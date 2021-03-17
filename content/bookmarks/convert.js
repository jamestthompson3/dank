const bookmarks = require("./exports.json");
const fs = require("fs");

for (const bookmark of bookmarks) {
  fs.writeFile(`${bookmark.index}.md`, createMd(bookmark), (err, d) => {
    if (err) {
      console.error(err, bookmark.index);
    }
  });
}

function createMd(bookmark) {
  return `---
title: "${bookmark.title}"
tags: [${bookmark.tags.replace("2021mar14,", "")}]
bookmark-of: "${bookmark.uri}"
---
${bookmark.description}`;
}
