---
title: Lessons from Building Tendril Wiki
page_title:  📖 Lessons from Building Tendril Wiki
author: Taylor Thompson
tags: [tools for thought, programming]
description: What I've learned from my hobby project building a tool for thought
images:
  - "https://images.unsplash.com/photo-1628428713349-965d613b3382?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
date: 2022-08-04
loc: tendril-wiki-lessons
---

Over the past year and half, I've been working on a knowledge management tool called, [Tendril Wiki](https://github.com/jamestthompson3/tendril-wiki). I've used it to organize my thoughts and catalogue information both at work and in my personal life. Tendril Wiki has served as a place for me to experiment with tooling ideas, gain more experience using the Rust programming language, and copy concepts from other tools for thought. After 18 months, I want to reflect on what I've learned and where I can improve.

## Limits of Markdown

Markdown was my first choice in the backing file format of Tendril Wiki for a few reasons:

1. easy to parse
2. quick to get started building a wiki (reading and writing plaintext files is trivial)
3. does not require a rich text editor
4. plaintext files integrate well with external tools.

Using markdown for the backing file format allowed for quick initial iterations, and simple custom extensions to the syntax (such as `[[Wiki Page]]` to link pages). As I wanted to add more advanced features to notes and create a richer text editing experience, I ran into some of the limitations of the markdown format.

A system which operates on data must be able to associate context with that data. This context informs the system or its operators how the data is processed. This pattern of context association via metadata appears in different forms (think EXIF for photos, [headers for HTTP / email](https://subconscious.substack.com/p/if-headers-did-not-exist-it-would), tags for notes, etc) and is most useful when the metadata specification is open-ended, allowing systems to implement and consume the context they find most beneficial. From a knowledge management perspective, different types of notes have different metadata associated with them. Notes about books have an author, notes referring to an article on the web have the associated URL, and all notes have information such as creation time, id, modification time, and tags.

The CommonMark markdown specification does not have a way to add headers or metadata. As a result, headers became the first extension I had to implement. I decided to go with the same format used by the static site generator, [Jekyll](https://jekyllrb.com/) where headers are colon separated key-value pairs at the beginning of the document and contained between `---` as delineators. Tendril Wiki can execute specific actions depending on the metadata contained in the note headers. One drawback to this metadata approach and to the markdown format in general is that headers contain the metadata for a whole markdown document, making it hard to atomize chunks of the document as separate logical blocks. This means being able to compose notes as blocks of thought becomes difficult without the use of a rich text editor which handles atomization and block scoping automatically. Without under the hood data composition and decomposition, the user must manually create and link multiple small markdown files to achieve the nesting and composition from more popular tools like Roam Research, Notion, and Logseq.

## File Cabinet vs Scratchpad

I have kept a personal wiki for over two years now, and I've amassed hundreds of notes varying in length from a few lines to dozens of paragraphs. Searching through this aggregated knowledge is very helpful, especially with the search engine that comes with Tendril Wiki. Yet, I have noticed that my personal wiki is more a tool for thoughts to reside, rather than a tool for thinking. When sketching out an idea or keeping track of my debugging progress, I often use the interstitial journaling feature of Tendril Wiki which allows you to fire and forget a thought from the home page. A fundamental friction arises from this workflow that strikes at the heart of the tools for thoughts vs tools for thinking dichotomy: Tendril Wiki has read and a write modes which need to manually activated to add or review your thoughts. A much better approach to achieving the breakthrough power of the scratchpad is to have the line between read and write mode eliminated, allowing users to view and edit the rendered text inline.

Rich inline editing combined with automatic block creation and linking improves a tool like Tendril Wiki, and shifts the momentum away from archival and more towards jotting down ideas that are composed later. To achieve this, I would need to implement a rich text editor for Tendril Wiki which would both remove friction from creating and editing text as well as make it easier to break ideas up into smaller, composable blocks. These blocks could then have associated block types which could be composed into collections (imagine bookmarked articles or videos in a table format), or essays, or blog posts, or tweets. The lack of rich inline editing and automatic data decomposition are the two biggest weaknesses in the Tendril Wiki architecture.

## JavaScript Not Required (sort of)

At the start of the Tendril Wiki project, I had an interested in how far I could push HTML and CSS towards making a featureful application without the use of JavaScript. Approaching client-side development through this lens helped in validating ideas and getting initial features working quickly, but did not lead to the best outcome for future development. I have tried to use "progressive enhancement" where the application works without the use of JavaScript and where JS sprinkled lightly on top of the application adds quality of life features. This definition of progressive enhancement works well for simple text editing, keyboard shortcuts, and automatic uploading of images pasted into a note, but is not adequate for an application that requires rich inline text editing.

When rich editing comes to Tendril Wiki, the current application where JS does not need to be present for it to be functional will be hidden in a `<noscript>` tag. Doing this will allow me to redefine progressive enhancement to mean the page loads in quickly with most of the UI elements in place, and when the JS loads, it unlocks the advanced functionality expected from a feature rich, modern web application.

## What's Next

I want to continue pushing Tendril Wiki forward to be a tool for thinking as well as a tool for thoughts. Besides the above mentioned improvements of rich text editing, automatic block composition and decomposition, and a better backing file format, I want to explore the following ideas:

1. multiplayer wikis
2. infinite multimedia canvases
3. end-to-end encryption of notes
4. the ability of your notebook to automatically reflect different permutations of your thoughts

I am excited to see what Tendril Wiki looks like in 18 months from now!
