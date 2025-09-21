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

<<<<<<< HEAD
  // Debounce function
  function debounce(fn, delay) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), delay);
    };
=======
function sercxi() {
  //ตั้งตัวสำหรับสร้างลูป
  let vortoj_Arr, i;
  for (i = 0; i < disigitaj_vortoj.length; i++) {
    vortoj_Arr = disigitaj_vortoj[i];
  }
  //filter array จาก textInput
  //[2] ค้นหา
  //เรียกข้อความที่จะค้นหา
  let str_sxablono = document.getElementById("enigo").value;
  //ใส่ hash ที่ url
  location.hash = str_sxablono

  //ค้นหาข้อความด้วย regex
  //https://stackoverflow.com/a/50828436
  let sxablono_regex = new RegExp(`${str_sxablono}`, "g");
  //https://www.delftstack.com/howto/javascript/javascript-filter-string/
  let rezulto = disigitaj_vortoj.filter(function (str) {
    return sxablono_regex.test(str);
  });
  console.log('REZULTO', rezulto)
  //การแสดงผลการค้นหาแบบตรงตัว

  //[3] เตรียมแสดงผล
  //สร้างข้อความ หากข้อความค้นหาว่างเปล่า
  if (str_sxablono === "") {
    rezulto = "ไม่พบคำค้นหา";
    return document.getElementById("eligo").innerHTML = "<hr>" + rezulto;
>>>>>>> ab5a7ec47df49d812e92bd50784736e5629c578d
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
      thai.innerHTML = " → " + item.thai.map(t => highlightText(t, matches, "thai")).join(", ");

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