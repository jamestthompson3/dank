var fuse; // holds our search engine
var firstRun = true; // allow us to delay loading json data unless search activated
var list = document.getElementById("searchResults"); // targets the <ul>
var first = list.firstChild; // first child of search list
var last = list.lastChild; // last child of search list
var maininput = document.getElementById("searchInput"); // input box for search
var resultsAvailable = false; // Did we get any search results?

  // ==========================================
  // The main keyboard event listener running the show
//
  //
  function activateSearch(event) {
    // CMD-/ to show / hide Search
    // Load json search index if first time invoking search
    // Means we don't load json unless searches are going to happen; keep user payload small unless needed
    if (firstRun) {
      loadSearch(); // loads our json data and builds fuse.js search index
      firstRun = false; // let's never do this again
    }

    // DOWN (40) arrow
    if (event.keyCode == 40) {
      if (searchVisible && resultsAvailable) {
        event.preventDefault(); // stop window from scrolling
        if (document.activeElement == maininput) {
          first.focus();
        } // if the currently focused element is the main input --> focus the first <li>
          else if (document.activeElement == last) {
            last.focus();
          } // if we're at the bottom, stay there
        else {
          document.activeElement.parentElement.nextSibling.firstElementChild.focus();
        } // otherwise select the next search result
      }
    }

    // UP (38) arrow
    if (event.keyCode == 38) {
      if (searchVisible && resultsAvailable) {
        event.preventDefault(); // stop window from scrolling
        if (document.activeElement == maininput) {
          maininput.focus();
        } // If we're in the input box, do nothing
        else if (document.activeElement == first) {
          maininput.focus();
        } // If we're at the first item, go to input box
        else {
          document.activeElement.parentElement.previousSibling.firstElementChild.focus();
        } // Otherwise, select the search result above the current active one
      }
    }
  }
document.addEventListener("keydown", activateSearch);
document.getElementById("searchInput").addEventListener("click", activateSearch);

// ==========================================
  // execute search as each character is typed
//
  document.getElementById("searchInput").onkeyup = function (e) {
    if (e.which === 27) {
      this.value = ""
      executeSearch(this.value);
      this.blur()
    } else  {
      executeSearch(this.value);
    }

  };

// ==========================================
  // fetch some json without jquery
//
  function fetchJSONFile(path, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
          var data = JSON.parse(httpRequest.responseText);
          if (callback) callback(data);
        }
      }
    };
    httpRequest.open("GET", path);
    httpRequest.send();
  }

// ==========================================
  // load our search index, only executed once
// on first call of search box (CMD-/)
//
  function loadSearch() {
    fetchJSONFile("/index.json", function (data) {
      var options = {
        // fuse.js options; check fuse.js website for details
        shouldSort: true,
        location: 0,
        distance: 100,
        threshold: 0.4,
        minMatchCharLength: 2,
        keys: ["title", "permalink", "summary"],
      };
      fuse = new Fuse(data, options); // build the index from the json file
    });
  }

// ==========================================
  // using the index we loaded on CMD-/, run
// a search query (for "term") every time a letter is typed
// in the search box
//
  function executeSearch(term) {
    let results = fuse.search(term); // the actual query being run using fuse.js
    let searchitems = ""; // our results bucket

    if (results.length === 0) {
      // no results based on what was typed into the input box
      resultsAvailable = false;
      searchitems = "";
    } else {
      const unique = new Map()
      results.forEach(( { item } ) => {
        if (unique.has(item.permalink)) {
          return;
        }
        unique.set(item.permalink, item)
      });
      const iterator = Array.from(unique.values())
      // build our html
      for (let item of iterator.slice(0, 5)) {
        // only show first 5 results
        const newHMTL = `<li>
          <a href="${item.permalink}" tabindex="0" class="result"><span class="title">${item.title}</span>
          <br /> <span class="sc">${item.section}</span><em>${item.desc || item.contents}</em>
          </a>
          </li>`
        searchitems = searchitems.concat(newHMTL);

      }
      resultsAvailable = true;
    }

    document.getElementById("searchResults").innerHTML = searchitems;
    if (results.length > 0) {
      first = list.firstChild.firstElementChild; // first result container — used for checking against keyboard up/down location
      last = list.lastChild.firstElementChild; // last result container — used for checking against keyboard up/down location
    }
  }
