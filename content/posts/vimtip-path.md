---
title: Neovim Tip, Smarter Path
page_title: 💡 5 Minute Neovim Tip - Smarter Path
author: Taylor Thompson
tags: [neovim, vim, lua, productivity]
description: Easily set your vim path per project and get only the files you want.
keywords: [neovim, vim, path, project path, fd]
images:
  - "https://neovim.io/images/logo@2x.png"
date: 2021-11-11
loc: vimtip-path
---

## Intro

Fuzzy finders can be a good tool for navigating files in a codebase, but they don't give you the
same functionality as a properly set `path` option in vim. Key mappings like `gf`, `[i`, `[d`, and
commands like `:find` depend on having your path set correctly to find the file you're searching
for. Using the `:find` command also gives us the ability to tab complete a file name, a feature
which fuzzy finders do not offer.

An poorly set path can cause a significant slow down when trying to tab complete a filename with
`:find`, or jump to a file with `gf`, especially if you work with languages like javascript where
projects contain the fathomless void known as `node_modules`.

In his [excellent gist](https://gist.github.com/romainl/7e2b425a1706cd85f04a0bd8b3898805), romainl
illustrates how a well set path can make navigating a codebase quick and easy, capturing only the
files relevant to our work in a project. However, in his gist he sets the path manually, what I want
to do is automatically set the path on a per-project basis. My answer to this, is to use [fd](https://github.com/sharkdp/fd).

## The Code

I added the following code to my `init.lua`, but it can work in vimscript and in regular vim as
well! This requires that you have the `fd` binary installed on your machine.

```lua
vim.o.path = table.concat(vim.fn.systemlist("fd . --type d"),",")
```

Since `fd` will respect your `.gitignore` file, the above code will set every directory currently
tracked by git in your path, ensuring that you can access your project files without having to deal
with slowdowns caused by vim looking inside of directories such as `node_modules`.

To speed things up when you open a directory in a path that is not currently tracked by git, you
can use the following snippet:

```lua

local setPath = function()
  if gitBranch() ~= "" then
    return table.concat(vim.fn.systemlist("fd . --type d --hidden -E .git -E .yarn"),",,") .. "," .. table.concat(vim.fn.systemlist("fd --type f --max-depth 1"), ","):gsub("./", "") -- grab both the dirs and the top level files
  else
    return vim.o.path
  end
end

vim.o.path = setPath()
```
