function registerSW() {
  // if (location.hostname === "localhost") return;
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw-prod.js").catch(e => {
      console.log("Registration fail: ", e);
    });
  }
}

registerSW();
