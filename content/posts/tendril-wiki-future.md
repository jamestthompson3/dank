---
title: What's next for Tendril Wiki
page_title: 🪴 Tendril Wiki 2
author: Taylor Thompson
tags: [tools for thought, programming]
description: Where I want to take Tendril Wiki and how I want my thoughts to be organized.
images:
  - "/static/images/tendril-wiki-2.png"
date: 2022-08-19
loc: tendril-wiki-next
---

In my [last post](https://teukka.tech/posts/tendril-wiki-lessons/), I discussed some of the lessons I learned from building my personal knowledge management tool, Tendril Wiki. I want to discuss my vision for the tool and ideas around knowledge management. The main goal of Tendril Wiki is to collapse the tools I use for managing information into a single, unified platform. The functionality in Tendril Wiki arises from my own personal needs or from features I've seen other platforms / tools implement and wanted for myself.

As satisfying as it is to have "Taylor's random interests and needs" driven development, I would invite you, the reader, to download Tendril Wiki and tell me what you like, what you hate, and what strange and wonderful paths down which you'd like your thoughts to carry your tools. This post is meant to be a wishlist and a place for me to think out loud, perhaps in a year from now I'll have accomplished the features discussed here, or I'll be shaking my head while thinking about how different things turned out.

## Reducing friction

The modal style of editing notes is one of the biggest annoyances I've had with Tendril Wiki, and it prevents using my notebook as a scratchpad like with tools such as Roam Research or Logseq. Tendril Wiki supports interstitial journaling and adding to your daily note from the home page, but you cannot view what you have already written for the day while simultaneously adding new information. To do this, you must first click the link for the daily note page and click the edit button.

To reduce this friction, I want to implement an editor which removes the barrier between viewing and editing and allows you to click on the blocks you want to edit instead of changing the modal view for the entire document. A new, non-modal editor necessitates more client-side JavaScript code, and in an effort to keep performance reasonable, I am accompanying the editor changes with a simplified wikitext syntax. Inspired by projects like Subtext, the new wikitext syntax follows the "you aren't going to need it" (YAGNI) principle to reduce the parsing and processing needed on the client side.

Adopting a reduced wikitext syntax reinforces the idea that notes are not meant to be formatted for complex presentation like a published blog post or essay. Notes are comprised of lines (or as they are called in the new Tendril Wiki paradigm, blocks) and published documents are comprised of notes that are synthesized and laid out in a particular manner by their author. By preventing notes from having the ability to contain complex formatting, writers can be more focused on the content of the note and less focused on implementing complex layout structures or templates.

Paring down the wikitext syntax also opens up the door for expressive block types. In the current version of Tendril Wiki, all blocks are text, and their content needs to be evaluated and transformed by the markdown parser to be properly rendered in the case of multi-media / special embed blocks. Since there is no way to indicate _which_ special case should be handled ahead of time, the process ends up being a lengthy and hard to read code block for parsing out bits of text and matching them to their proper multi-media render format.

With a content-type header, blocks or notes explicitly specify their type, making it faster and easier to build out custom rendering solutions for content like YouTube videos, Code Sandbox editors, or links to a podcast episode. Content-Type headers also allow blocks to be shared to others, allowing their tools to parse and display the content as it suits them.

## Collections

I use an external service to make my browser bookmarks sorted and tagged, and ensure that I'm able to search the full text content of everything I bookmark. Until recently, the service I use for managing bookmarks did not have a way to associate notes about the webpage with the bookmark itself. One of my goals with Tendril Wiki is to take the features I like about my bookmark manager and merge them with my note taking tools. Tendril Wiki supports bookmarking URLs and it attempts to download and archive a copy of the webpage the page's contents appear in the Tendril Wiki search results. The next step in bookmark management is to improve the user experience surrounding bookmarks and collections in general.

In Tendril Wiki, everything is a note. Bookmarks, tags, and even your todo list is a note. The "everything is a note" paradigm works well until you have a collection of items you want to edit and display in a format besides a backlinked note. This shortcoming is evident if you have many bookmarks in Tendril Wiki and try to manage them by via the bookmark note that each bookmarked URL is tagged with upon creation. If you extend the UX paradigm to other pieces of information you would like to collect (think images like Pinterest or videos from around the web), the usability degrades even further.

As a composition of smaller pieces of data, collections are a lens into content which exists in your notebook. In a sense, collections hold the state of a filter/aggregator function, label the function, and describe the layout rules for displaying the content which meets the filter/aggregate criteria. An open ended specification allows collections to evolve as both the types of content in your notebook your thoughts about the content evolve. This means that collections become notes which contain logical rules concerning which pieces of content to gather from your collection, and how to display them.

## Feeds

> My eyes have become two hungry mouths pressed against the
> Terrarium window [the screen between the material world, the Terrarium, and cyberspace] through
> which electronic pulses reach the receptive areas of my brain. My brain seems to require a daily
> input of several billion bytes of digital (light-speed) information.

- Timothy Leary, _Chaos and Cyberculture_ 1994

Networked feeds are a primary source of information for what Leary dubs, "homo sapiens electronicus" (Chaos and Cyberculture, 45), and should addressed as part of any software which manages personal knowledge in a digital world. The first target for feed integration into Tendril Wiki will be RSS. Reading articles from RSS feeds side by side with your notes in Tendril Wiki allows you to take notes without jumping between tabs or applications. By offering the ability to annotate and curate information from RSS, Tendril Wiki allows you to take a more active role in information consumption.

Tendril Wiki is not a purely navel gazing platform, and therefore must facilitate both the consumption and production of streams of information. You are able to publish your notebook as a static site, with each note compiled into its own standalone HTML page. Static compilation on the scale of individual notes allows you to share the entire notebook or select parts. Static site publishing, however, is not a swift enough stream of information to qualify as a feed, which means Tendril Wiki's publishing capabilities must be augmented to include syndication. In addition to consuming RSS feeds, Tendril Wiki should offer the ability to syndicate select notes to an RSS feed to allow others to read what you share. Syndication targets should not be limited to RSS feeds, and one of the long term goals of Tendril Wiki is to allow you to syndicate to the Noosphere.

## Into the Noosphere

The Noosphere is a project which aims to produce a global knowledge graph ([Subconscious Substack](https://subconscious.substack.com/p/noosphere-a-protocol-for-thought)) powered by IPFS. The Noosphere is a protocol rather than a platform, it is not a silo which traps your data, nor is it an mandatory part of using Tendril Wiki. Instead, your Tendril Wiki server can become a gateway to the Noosphere, allowing you to federate or consume content, keep (encrytped) backup copies of your notes on IPFS, and sync with other Noosphere client applications you use. Although the Noosphere project is in its early stages, I see permissionless protocols such as the Noosphere as an important part of sharing knowledge with others.
