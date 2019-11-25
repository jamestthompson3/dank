(function buildHeader() {
  let start = { x: 0, y: 0 };
  const header = document.createElement("div");
  header.style.height = "40px";
  header.style.zIndex = "9999";
  header.innerHTML =
    "<a href='/'><h4 style='padding: 0px 8px;'>← Back to Home</h4></a>";
  const body = document.querySelector("body");
  const main = document.querySelector(".mainwrapper");
  body.insertBefore(header, body.childNodes[0]);

  main.addEventListener("touchMove", touchMove, false);
  main.addEventListener("touchStart", touchStart, false);

  function touchStart(event) {
    start.x = event.touches[0].pageX;
    start.y = event.touches[0].pageY;
  }

  function touchMove(event) {
    offsetX = start.x - event.touches[0].pageX;
    offsetY = start.y - event.touches[0].pageY;
    if (window.innerWidth <= 450) {
      if (offsetY <= -30) {
        header.style.position = "fixed";
      }
      if (offsetY >= 30 && header.style.position === "fixed") {
        header.style.position = "static";
      }
    }
  }
})();
