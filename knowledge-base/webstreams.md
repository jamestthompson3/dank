---
title: Web Stream Notes
author: Taylor Thompson
tags: [streams, javascript, browser]
---


* Streams are used under the  hood for fetch, for upload and download
* Streams implement a pull model, *_pull models are inherently single-consumer_*
* Observables (rxjs) deliver values _synchronously_, streams run in microteasks, making them async
