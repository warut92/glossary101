let dictionary = [];
  let fuse;

  const searchInput = document.getElementById("search");
  const resultsDiv = document.getElementById("results");

  // Fetch JSON externally
  fetch("words.json")
    .then(response => response.json())
    .then(data => {
      dictionary = data;
      fuse = new Fuse(dictionary, {
        keys: ['english', 'thai'],
        includeMatches: true,
        threshold: 0.3
      });

      // Load initial search from hash (if any)
      loadFromHash();
    })
    .catch(err => {
      resultsDiv.innerHTML = "<p style='color:red'>❌ Failed to load words.json</p>";
      console.error("Error loading JSON:", err);
    });

  // Debounce function
  function debounce(fn, delay) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // Update results on input
  searchInput.addEventListener("input", debounce(() => {
    const query = searchInput.value.trim();
    location.hash = encodeURIComponent(query); // update URL hash
    displayResults(query);
  }, 200));

  // Highlight matched parts
  function highlightText(text, matches, key) {
    if (!matches) return text;
    let locations = [];
    matches.forEach(match => {
      if (match.key === key) {
        locations = locations.concat(match.indices);
      }
    });
    if (!locations.length) return text;
    let result = "";
    let lastIndex = 0;
    locations.forEach(([start, end]) => {
      result += text.slice(lastIndex, start);
      result += "<mark>" + text.slice(start, end + 1) + "</mark>";
      lastIndex = end + 1;
    });
    result += text.slice(lastIndex);
    return result;
  }

  // Display results
  function displayResults(query) {
    if (!fuse) return;
    resultsDiv.innerHTML = "";

    let results = query
      ? fuse.search(query)
      : dictionary.map(d => ({ item: d, matches: [] }));

    if (!results.length) {
      resultsDiv.innerHTML = "<p>ไม่พบผลลัพท์</p>";
      return;
    }

    results.slice(0, 50).forEach(result => {
      const { item, matches } = result;
      let div = document.createElement("div");
      div.classList.add("entry");
    
      let eng = document.createElement("span");
      eng.classList.add("english");
      eng.innerHTML = highlightText(item.english, matches, "english");
    
      let thai = document.createElement("span");
      thai.classList.add("thai");
      thai.innerHTML = " : " + highlightText(item.thai, matches, "thai");
    
      div.appendChild(eng);
      div.appendChild(thai);
      resultsDiv.appendChild(div);
    });
  }

  // Load search term from hash
  function loadFromHash() {
    if (location.hash) {
      const term = decodeURIComponent(location.hash.slice(1));
      searchInput.value = term;
      displayResults(term);
    } else {
      displayResults(""); // show all at first load
    }
  }

  // React if hash changes manually
  window.addEventListener("hashchange", loadFromHash);