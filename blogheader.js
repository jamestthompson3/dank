(function buildHeader() {
  let start = { x: 0, y: 0 };
  const header = document.createElement("div");
  header.style.height = "40px";
  header.style.zIndex = "9999";
  header.innerHTML =
    "<a href='/'><h4 style='padding: 0px 8px; font-size: 1rem;'>← Back to Home</h4></a>";
  header.ariaLabel = "back";
  header.role = "button";
  header.style.fontFamily = "monospace";
  const body = document.querySelector("body");
  const main = document.querySelector(".mainwrapper");
  body.insertBefore(header, body.childNodes[0]);

  body.addEventListener("touchMove", touchMove, false);
  body.addEventListener("touchStart", touchStart, false);

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

function copyFallback(){
  const input = document.createElement('textarea')
  input.value = "https://teukka.tech/feed.xml"
  input.style.display = "none"
  document.head.appendChild(input)
  input.focus()
  input.select()
  <!-- input.setSelectionRange(0,9999) -->
  document.execCommand('copy')
  document.head.removeChild(input)
}


  function copyFeed() {
    const text = document.getElementById("feed");
    if (!navigator.clipboard) {
      copyFallback();
    } else {
      navigator.clipboard.writeText("https://teukka.tech/feed.xml");
    }
    text.classList.add("tooltip");
    setTimeout(() => {
      text.classList.remove("tooltip");
    }, 600);
  }

  const footer = document.createElement("span");
  footer.innerHTML =
    '<p tabindex="1" data-tip="link copied!" class="footer" id="feed">📃 Follow the RSS feed</p>';
  body.appendChild(footer);
  const feed = document.getElementById("feed");
  feed.addEventListener("click", copyFeed);
})();
