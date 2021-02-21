const tabs = document.querySelectorAll('[role="tab"]');
const tabList = document.querySelector('[role="tablist"]');

// no double border
const codeBoxes = document.querySelectorAll("pre");
const panels = document.querySelectorAll('[role="tabpanel"]');
panels.forEach(panel => {
  panel.style.padding = "0px 12px";
});
codeBoxes.forEach(box => {
  box.style.border = "none";
  box.style.width = "auto";
});

tabs.forEach(tab => {
  tab.addEventListener("click", changeTabs);
});

let tabFocus = 0;

tabList.addEventListener("keydown", e => {
  // Move right
  if (e.keyCode === 39 || e.keyCode === 37) {
    tabs[tabFocus].setAttribute("tabindex", -1);
    if (e.keyCode === 39) {
      tabFocus++;
      // If we're at the end, go to the start
      if (tabFocus >= tabs.length) {
        tabFocus = 0;
      }
      // Move left
    } else if (e.keyCode === 37) {
      tabFocus--;
      // If we're at the start, move to the end
      if (tabFocus < 0) {
        tabFocus = tabs.length - 1;
      }
    }

    tabs[tabFocus].setAttribute("tabindex", 0);
    tabs[tabFocus].focus();
  }
});

function changeTabs(e) {
  const target = e.target;
  const parent = target.parentNode;
  const grandparent = parent.parentNode;

  // Remove all current selected tabs
  parent.querySelectorAll('[aria-selected="true"]').forEach(t => {
    t.setAttribute("aria-selected", false);
    t.classList.remove("selected");
  });

  // Set this tab as selected
  target.setAttribute("aria-selected", true);
  target.classList.add("selected");

  // Hide all tab panels
  grandparent
    .querySelectorAll('[role="tabpanel"]')
    .forEach(p => p.setAttribute("hidden", true));

  // Show the selected panel
  const selectedPanel = grandparent.parentNode.querySelector(
    `#${target.getAttribute("aria-controls")}`
  );

  selectedPanel.removeAttribute("hidden");
  selectedPanel.classList.add("highlighted");
}
