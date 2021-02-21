---
title: Neovim Tip, GitLens
page_title: 💡 5 Minute Neovim Tip - GitLens
author: Taylor Thompson
tags: [neovim, lua, productivity]
description: Replicate the basic functionality VSCode's GitLens in 26 lines of lua
keywords: [neovim, gitlens, vscode git lens neovim]
images: ["https://neovim.io/images/logo@2x.png"]
date: 2020-01-28
aliases:
  - vimtip-gitlens.html
loc: vimtip-gitlens
---

## Intro

[GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) is a VSCode plugin that, among other things, allows you to see the time, commit author, and commit message of the current line. With a little help from to the neovim api and our shell, it we can recreate this functionality in a few lines of lua code.

## The Code

```lua
-- in utils.lua
local M = {}
local api = vim.api
function M.blameVirtText()
  local ft = vim.fn.expand('%:h:t') -- get the current file extension
  if ft == '' then -- if we are in a scratch buffer or unknown filetype
    return
  end
  if ft == 'bin' then -- if we are in nvim's terminal window
    return
  end
  api.nvim_buf_clear_namespace(0, 2, 0, -1) -- clear out virtual text from namespace 2 (the namespace we will set later)
  local currFile = vim.fn.expand('%')
  local line = api.nvim_win_get_cursor(0)
  local blame = vim.fn.system(string.format('git blame -c -L %d,%d %s', line[1], line[1], currFile))
  local hash = vim.split(blame, '%s')[1]
  local cmd = string.format("git show %s ", hash).."--format='%an | %ar | %s'"
  if hash == '00000000' then
    text = 'Not Committed Yet'
  else
    text = vim.fn.system(cmd)
    text = vim.split(text, '\n')[1]
    if text:gmatch("fatal") then -- if the call to git show fails
      text = 'Not Committed Yet'
    end
  end
  api.nvim_buf_set_virtual_text(0, 2, line[1] - 1, {{ text,'GitLens' }}, {}) -- set virtual text for namespace 2 with the content from git and assign it to the higlight group 'GitLens'
end

function M.clearBlameVirtText() -- important for clearing out the text when our cursor moves
  api.nvim_buf_clear_namespace(0, 2, 0, -1)
end

return M
```

```vim
" in init.vim
lua vim.api.nvim_command [[autocmd CursorHold   * lua require'utils'.blameVirtText()]]
lua vim.api.nvim_command [[autocmd CursorMoved  * lua require'utils'.clearBlameVirtText()]]
lua vim.api.nvim_command [[autocmd CursorMovedI * lua require'utils'.clearBlameVirtText()]]

hi! link GitLens Comment
```
