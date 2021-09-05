---
date: "2021-03-27T15:20:16.977Z"
title: "The Problem with Threads"
tags: [programming]
slug: "The-Problem-with-Threads"
kind: "update"
bookmark-of: "https://www2.eecs.berkeley.edu/Pubs/TechRpts/2006/EECS-2006-1.pdf"
---
Threads are a seemingly straightforward adaptation of the dominant sequential model of computation to concurrent systems.  Languages require little or no syntactic changes to sup-port threads, and operating systems and architectures have evolved to efficiently support them.Many technologists are pushing for increased use of multithreading in software in order to take advantage of the predicted increases in parallelism in computer architectures.  In this paper, I argue that this is not a good idea.