function registerSW() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw-prod.js").catch(e => {
      console.log("Registration fail: ", e);
    });
  }
}

location !== "localhost" || registerSW();
