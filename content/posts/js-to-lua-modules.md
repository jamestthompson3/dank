---
title: "(Nvim) Lua for Javascripters: Module Exports"
page_title: "(Nvim) Lua for Javascripters: Module Exports"
author: Taylor Thompson
tags: [lua, libuv, neovim]
slug: js-to-lua-modules
description: A quick overview on exporting lua code as modules
published: true
date: 2021-03-31
---

## Goals
This aims to be quick reference guide on lua module exports compared to JavaScript module exports.

## Task
We want to export a series of module scoped functions in both JavaScript and Lua. This guide also show side by side comparisons on writing a file to a specific directory and deleting a file from the same directory.

In this quick tip, we will use CommonJS as the format for the JavaScript modules since it more closely resembles Lua modules in its construction.

To export modules in NodeJS we would write:

```js
// filesystemUtils.js

const util = require("util")

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const readDir = util.promisify(fs.readdir);
const deleteFile = util.promisify(fs.unlink);

function writeDataFile(name, data) {
  const dataDir = getDataDir();
  const filePath = `${dataDir}${name}.json`;
  return writeFile(filePath, JSON.stringify(data));
}

function deleteDataFile(name) {
  const dataDir = getDataDir();
  const filePath = `${dataDir}${name}.json`;
  return deleteFile(filePath);
}

module.exports = {
  writeDataFile,
  deleteDataFile
}
```

Where `writeDataFile` and `deleteDataFile` are the function being exported. We could them access them by requiring the `filesystemUtils` module:

```js
const fs_utils = require("./filesystemUtils")

fs_utils.writeDataFile("test")
fs_utils.deleteDataFile("test")
```


In Lua, the syntax is quite similar:

```lua
-- filesystemUtils.lua

local M = {} -- initialize an empty table (or object in JS terms)

-- re-assign functions for convienience
local uv = vim.loop

-- assign the function to a key of the same name in the table
function M.deleteDataFile(name)
  local dataDir = getDataDir()
  local filePath = dataDir .. name .. ".json"
  return uv.fs_unlink(filePath)
end

function M.writeDataFile(name, data)
  local dataDir = getDataDir()
  local filePath = dataDir .. name .. ".json"
  return uv.fs_open(filePath, function (err, fd)
      if (err) then return end
      uv.fs_write(fd, data, function(err, bytes_written)
        if (err) then return end
        uv.fs_close(fd, function(err)
          if (err) then return end
        end)
      end)
  end)
end

return M -- This line exports the table
```

We can then use these functions in other code:

```lua
local fs_utils = require("filesystemUtils")

fs_utils.writeDataFile("test")
fs_utils.deleteDataFile("test")
```

Using modules in lua helps keep the global scope clean and makes it easier to refactor and reorganize code.
