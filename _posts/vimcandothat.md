---
title: Vim does that already
published: false
description: Exploring some of the built in functionality of Vim you may not know exists
tags: vim, productivity
loc: vimcandothat
---

## Power to Productivity

Vim is a powerful tool which helps you stay productive and spend less time doing the mechanical work of coding.
For many, Vim seems archaic, under-featured, or even intimidating. I hope to illustrate that Vim none of those things, but is in fact a great editor for nearly every development environment.

I want to focus on three common tasks where Vim helps you be more productive without leaving your editor. These tasks are: navigation between files, and searching / replacing.
No Vim experience is necessary for this post, but it definitely helps if you are at least familiar with the basics through `vimtutor`.

## Navigation Between Files

One of the most common and time consuming activities we do as developers every day is jump between files.
If you are using a more traditional text editor such as VSCode, Sublime Text, or Atom, chances are you spend more time that you would like
scanning through your directory tree trying to find the right file. With Vim, the secret to file navigation begins with `set path`.

The `path` is where Vim searches for files when executing the various search commands. By default on Unix-like systems, it is `.,/usr/include,,`. Let's break this down a bit. The first `.` indicates that Vim should include files relative to the current file's directory.
Directories that should be searched are separated by commas, so the next place Vim will look by default is the `/usr/include/` directory.
This directory typically contains headers so it can be useful if you are doing C and C++ programming. The final sequence of `,,` instructs Vim to search in the current directory.
Out of the box, we are able to search a large part of our project. What if we wanted to search downward recursively through our project?
It is common to open your text editor in your project root ( often denoted by a vcs file such as a `.git` folder ).
To ensure that Vim finds all of our project files when we search for them, we use `*` and `**`.
The asterisks represent wildcards, with `*` matching 0 or more characters and `**` matching only directories. By setting your path to `set path=.,,,**`, you can ensure that Vim will search all our project files.
One caveat to this is that by default `**` only searches 30 directories deep, so if you have an extremely nested directory structure, you can increase that limit, see `:h starstar` for more details.
Now that we have our path correctly set, it's time to navigate! Vim has a built in keybinding for jumping to the file under your cursor, and it is `gf`. We tell Vim which file endings it should add by using `set suffixesadd`.
So for frontend web development, you might have something in your `vimrc` that looks like this: `au! BufNewFile,BufRead *.js,*.jsx suffixesadd+=.js,.jsx`. This allows us to jump to files with endings `.js and .jsx`.

In practice it looks like this:

```js
import { someFunction } from "./utils";
```

Placing your cursor in normal mode on `./utils` and pressing `gf` should take
you to the `utils.js` file!

This is just the tip of the iceberg of what Vim can do when it comes to searching through your code, for a more in-depth take on this, I would recommend the blog post, [death by a thousand files](https://vimways.org/2018/death-by-a-thousand-files/).
I want to show one more useful command that benefits from having set our `path` to search downward recursively and that is `find`. With `find`, Vim will search for a file and then open it for editing if the file is found. We can also use
`*` wildcard expansion and tab completion if we have the `wildmenu` setting on.

For example, typing: `:find N*C*.jsx` and pressing tab would expand to `NavigationContainer.jsx`. You could also type `Navigation` and tab to expand all the options that Vim finds in the current path. Just like that, you can fuzzy search through your project without any additional configuration or plugins.
Sometimes, there are directories in the project which we would like to ignore, such as `node_modules`, `target`, and `dist`. Vim determines which files to ignore via the `wildignore` setting.
A sample `wildignore` may look like this: `set wildignore=*/dist*/*,*/target/*,*/builds/*,*/node_modules/*`. Vim will no longer include these directories in it's path.

## Find and Replace

By default, Vim ships with `vimgrep` which allows you to search for strings within files. Vim also comes with the `grep` command which allows you to search
using an external grep tool. I personally use [ripgrep](https://github.com/BurntSushi/ripgrep), a grep tool that is focused on speed and respects my `.gitignore` file by default.

To enable Vim to use ripgrep ( or any other grep program ) as a backend to the `grep` command, you need to set the grep program in your vimrc:

```viml
set grepprg=rg --smart-case --vimgrep
```

Now you have your search results loaded in the quickfix menu, and can leverage a Vim built-in plugin, `cfilter`. To add it, simply run `:packadd cfilter` and Vim will load the plugin for use. `cfilter` filters through entries in the quickfix list via regex.

If you have search results that look like this:

```
datastructures.html|623| 30:        mixpanel.track("data structures loaded");
index.html|61| 26:          <a href="./datastructures.html"
index.html|62| 19:            >Data Structure Memes For Edgy JavaScript Teens</a
_site/index.js|64| 28:           import { customStructure } from './datstructures'
_site/utils.js|64| 28:           import { customStructure } from 'custom/datstructures'
```

If you want to only keep the search results from the JavaScript files, you run this command: `:Cfilter! html`. This keeps everything except matches that contain
`html` in the quickfix list. If you wanted only to keep only the third match, you run `:Cfilter Memes` and it keeps only matches containing `Memes`.

One more useful command when using the quickfix list is `:cfdo`. It allows you to execute whatever command you give it across the entire quickfix list.
For example, if you wanted to search and replace you could do it like this:

search for the phrase, 'data structures':

`:grep! 'data structures'`

view results:

```
datastructures.html|279| 15:              Data Structures
datastructures.html|574| 26:              with these data structures, since the structure of our data is
datastructures.html|575| 43:              irrelevant to react, custom data structures should be simple to
datastructures.html|623| 25:        mixpanel.track("data structures loaded");
```

change 'structures' to singular 'structure' and save every file:

`:cfdo s/ures/ure | update`

The `| update` part of that last command tells Vim to save the changes after it executes the replace. If you wanted to check your changes
before saving, you leave that part off. You still have to save every file manually if you choose this option.

## Grep tips

Vim makes finding and replacing throughout a large codebase fast and easy. To make it even faster and easier, here are some things for your `vimrc`.

```viml
set grepprg=rg\ --smart-case\ --vimgrep " set grep program to ripgrep with smartcase flag. You can set it to anything you like.

" creates a :SearchProject command, makes it so you don't have to escape strings in ripgrep, will tab compete with directories in path.
command! -nargs=+ -complete=dir -bar SearchProject execute 'silent! grep!'.<q-args>.' | cwindow'
```

I hope that this post helps improve your Vim experience!
