---
title: "(Nvim) Lua for Javascripters: Spawning Processes"
page_title: "(Nvim) Lua for Javascripters: Spawning Processes"
author: Taylor Thompson
tags: [lua, libuv, neovim]
slug: js-to-lua
description: A quick overview on how to handle async processes in luv in Neovim
published: 2021-03-16
date: 2021-03-16
---
## Goals
This should be a quick reference guide for those familiar with NodeJS on how to execute the same async tasks in Lua using luv. This is aimed towards use cases inside Neovim, but is not limited to those cases.

## Task
We want to spawn a child task to convert a markdown document into HTML using [pandoc](https://pandoc.org/). This could be used as part of a publishing flow for a blog, for writing notes, or for implementing a markdown previewer.

```js
// in Node we could do it like this:
const {spawn} = require('child_process');
const [sourceFile, destinationFile] = process.argv.slice(2)

const convert = spawn('pandoc', [sourceFile, '--from', 'gfm', '--to', 'html5', '-o', destinationFile, '-s', '--highlight-style', 'tango'])

convert.stderr.on('data', (data) => {
  console.error(data);
});

convert.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

In Lua, the code looks very similar, but a bit more verbose:

```lua
-- The same as before, but this time we want to generate the file names 
-- based on the file we are currently editing instead of passing them as commandline args

function convert()
  -- cut off the `.md` part of the file
  local destinationFile = vim.fn.expand('%:t:r')
  -- the name of the file you're editing
  local sourceFile = api.nvim_buf_get_name(0)
  spawn('pandoc', {
    args = {sourceFile, '--from', 'gfm', '--to', 'html5', '-o', string.format('%s.html', destinationFile), '-s', '--highlight-style', 'tango'},
  }, 
  {stdout = function()end, stderr = function(data) print(data) end},
  function(code) -- we want to call this function when the process is done
    print('child process exited with code ' .. string.format('%d', code))
  end)
end

function spawn(cmd, opts, input, onexit)
  local handle, pid
  -- open an new pipe for stdout
  local stdout = vim.loop.new_pipe(false)
  -- open an new pipe for stderr
  local stderr = vim.loop.new_pipe(false)
  handle, pid = vim.loop.spawn(cmd, vim.tbl_extend("force", opts, {stdio = {stdout; stderr;}}), 
  function(code, signal)
    -- call the exit callback with the code and signal
    onexit(code, signal)
    -- stop reading data to stdout
    vim.loop.read_stop(stdout)
    -- stop reading data to stderr
    vim.loop.read_stop(stderr)
    -- safely shutdown child process
    safe_close(handle)
    -- safely shutdown stdout pipe
    safe_close(stdout)
    -- safely shutdown stderr pipe
    safe_close(stderr)
  end)
  -- read child process output to stdout
  vim.loop.read_start(stdout, input.stdout)
  -- read child process output to stderr
  vim.loop.read_start(stderr, input.stderr)
end

function safe_close(handle)
  if not vim.loop.is_closing(handle) then
    vim.loop.close(handle)
  end
end
```

One of the major differences is that in Lua you are responsible for cleaning up both the process handle and any pipes you have open to receive data from that handle. It then becomes useful to create a more generalized `spawn` function to handle all of these things under the hood, allowing you to just call `spawn` in a similar manner to the NodeJS API.
