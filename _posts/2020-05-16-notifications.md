---
title: Javascript Quick Tip -- Browser Notifications
author: Taylor Thompson
tags: [javascript, web development]
description: In-browser notifications, no server required!
date: 16 May. 2020
loc: notifications
---

## Let 'Em Know

While notifications are one of the browser features that are often abused and lead to obnoxious spam, there are still use cases where notifications enhance the experience of your web application. Modern browsers (with the exception of iOS Safari), support two types of notifications: [push](https://developer.mozilla.org/en-US/docs/Web/API/Push_API), and [web](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API). This post discusses _only_ web notifications, since they do not require registration on a server, or the use of a service worker (although they can be used with both). After a short intro on how to set up web notifications, we'll dive into an example where web notifications are a useful addition to your web app.

## Getting Started

To start using web notifications you must request permissions from the user. Important note: you cannot request notification permissions over insecure connections, which means you must be serving your application over HTTPS or from your localhost. Once you are serving you app over HTTPS or from your localhost, requesting permissions is straight forward:

```html
<h1>Permission Spam</h1>
<p>Your current notification status is: <span id="permStatus"></span></p>

<script>
const status = document.getElementById('permStatus')
const currentPermission = Notification.permission
status.textContent = currentPermission
if (currentPermission === 'denied') {
  Notification.requestPermission().then(result => {
      status.textContent = result;
      })
}
</script>
```

The global `Notification` object exposes the `permission` property reflecting the current permission status and the `requestPermission` function which returns a promise resolving permission status given by the user after being prompted by the browser. In some browsers, such as Firefox 72 and onward, a popup requesting notifications won't be displayed; the promise from `requestPermission` pends until the user clicks on the icon allowing notifications from their URL bar.

### Note on above code

>In the snippet for above, the browser requests permissions as soon as the page is loaded. Additionally, if the user hasn't allowed notification permissions, they will be asked every time they visit the page. This is a *_horrible_* user experience. Nobody wants to be spammed with notifications, especially when no explanation of what type of events will trigger the notifications or how often they will be sent is given. Therefore, it is important that you never request notification permissions before giving an explanation of the notification behavior and after gathering user input for opting in.

For our examples, we will be using a [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) to manage the notification logic. This has the advantage of being off the main thread, which means that the logic is non-blocking and can be accessed via a global singleton for component based frameworks such as React, allowing all components to trigger notifications. One of the disadvantages of using a web worker for notifications is that the notifications are not triggered if the user closes the tab. To bypass that restriction, the example code will have to be executed in a [Service Worker](serviceworker.html).

## Example: Long Running Jobs

Some applications have long running jobs: processing an uploaded file, preparing data for download, executing a CI / CD pipeline, etc. Web notifications are a good way for users to "click and forget", setting the job in motion and continue to other parts of the application or backgrounding the tab and continuing to browse without having to constantly check the status of their work. When the job has finished, they get a notification that lets them inspect the final output. Let's get started!

```html
<!-- index.html -->
<button onclick="notifyOnDone()">Notify me when this job finishes</button>
<span id="permErr" style="display:none; color:red;">You must allow notifications to subscribe to this job</span>

<script>
  async function notifyOnDone() {
    const currentPerms = Notification.permission
    if (currentPerms === 'denied' || currentPerms === 'default') {
      const result = await Notification.requestPermission()
        if (result === 'denied') {
          document.getElementById("permErr").style.display = "block"
        }
    }
    const notifierWorker = new Worker('notifier.js')
    notifierWorker.postMessage({jobId: 123})
  }
</script>
```

Since our examples don't rely on the Push API, we'll implement the checks via long polling in our web worker:

```javascript
// notifier.js
onmessage = function(e) {
  switch (e.data.type) {
    case "JOB_START":
      watchForJobWithId(e.data.jobId);
      break;
    default:
      break;
  }
};

function watchForJobWithId(jobId) {
  // long polling
  const pollChanges = setInterval(() => {
    fetch("/jobs/completed")
      .then(res => res.json())
      .then(({ jobs }) => {
        const foundJob = jobs.find(job => job.id === jobId);
        if (foundJob) {
          const jobDoneNotificiation = new Notification(
            `Job finished with status: \n${foundJob.status}`,
            {
              body: foundJob.error ? `Error Code: ${foundJob.error}` : ""
            }
          );
        }
        clearInterval(pollChanges);
      });
  }, 30_000);
  window.onunload = () => pollChanges && clearInterval(pollChanges);
}
```

When users click the subscribe button, our worker polls the backend to see if the job has completed. If the job has finished, the worker triggers the notification with the status and any messages that are attached.

## Duly Noted

Finding the line between utility and spam is tricky. When finding use cases for notifications, be sure to offer the users preferences for what type of notifications they want to receive and how often they want to receive them. Well designed notification experiences increase the usability of your app and keep users abreast of important changes, increasing their engagement and satisfaction.

