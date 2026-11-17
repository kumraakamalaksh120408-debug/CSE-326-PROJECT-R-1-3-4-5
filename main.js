/* =========================================================
   CaseDesk - js/main.js
   JavaScript Fundamentals used in this file:
   1 Variables and constants   2 Data types   3 Arrays
   4 Objects                   5 Functions    6 Scope
   7 Operators and expressions 8 Strings      9 Numbers, Booleans
   10 Conditional statements   11 Array operations
   (a few DOM lines are needed so the page can react to the user)
   ========================================================= */

/* ---------- 1-4. VARIABLES, DATA TYPES, ARRAYS, OBJECTS ----------
   const = value that never changes   let = value that can change
   An array [ ] holds many values; each { } is an object with properties. */
const cases = [
  { id: "OLCMS-2026-001", title: "Sharma v. State Bank", type: "Civil",
    court: "District Court, Ludhiana", status: "Pending",
    hearing: "2026-11-18", judge: "Hon. R. Mehta", lawyer: "Adv. Kaur" },
  { id: "OLCMS-2026-002", title: "State v. Verma", type: "Criminal",
    court: "Sessions Court, Chandigarh", status: "Hearing",
    hearing: "2026-11-20", judge: "Hon. S. Gill", lawyer: "Adv. Rao" },
  { id: "OLCMS-2026-003", title: "Gupta Family Petition", type: "Family",
    court: "Family Court, Jalandhar", status: "Pending",
    hearing: "2026-11-25", judge: "Hon. A. Bedi", lawyer: "Adv. Nair" },
  { id: "OLCMS-2026-004", title: "Singh Properties v. Municipal Corp.",
    type: "Property", court: "High Court, Chandigarh", status: "Hearing",
    hearing: "2026-12-02", judge: "Hon. P. Anand", lawyer: "Adv. Kaur" },
  { id: "OLCMS-2026-005", title: "Mehra Traders Dispute", type: "Consumer",
    court: "Consumer Forum, Amritsar", status: "Disposed",
    hearing: "2026-10-30", judge: "Hon. L. Sethi", lawyer: "Adv. Iyer" },
  { id: "OLCMS-2026-006", title: "Khan v. Employer Ltd.", type: "Labour",
    court: "Labour Court, Patiala", status: "Pending",
    hearing: "2026-12-09", judge: "Hon. D. Arora", lawyer: "Adv. Rao" }
];

const lawyers = [
  { name: "Adv. Simran Kaur", area: "Civil & Property", exp: 12 },
  { name: "Adv. Rohan Rao", area: "Criminal Law", exp: 9 },
  { name: "Adv. Meera Nair", area: "Family Law", exp: 15 },
  { name: "Adv. Karan Iyer", area: "Consumer & Labour", exp: 7 }
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* Global scope: these variables can be used inside every function. */
let mine = [];          // cases filed in this session (array, starts empty)
let currentUser = null; // null = nobody logged in (null data type)
let theme = "light";    // string
let menuOpen = false;   // boolean

/* Shortcut function: finds an element on the page by its id. */
function el(id) {
  return document.getElementById(id);
}

/* ---------- 5. FUNCTIONS: parameters and return values ---------- */
function formatDate(iso) {            // "2026-11-18" -> "18 Nov 2026"
  const parts = iso.split("-");       // string method: split into an array
  const day = Number(parts[2]);       // string -> number
  const month = months[Number(parts[1]) - 1];
  return day + " " + month + " " + parts[0];
}

/* Returns the different values of one property, e.g. every case type. */
function uniqueValues(key) {
  const result = [];                  // local scope: only exists in here
  cases.forEach(function (c) {
    if (!result.includes(c[key])) {   // ! = NOT, bracket notation c[key]
      result.push(c[key]);            // push adds to the end of an array
    }
  });
  return result;
}

function fillSelect(id, values) {
  let html = "";
  values.forEach(function (v) {
    html += '<option value="' + v + '">' + v + "</option>";
  });
  el(id).innerHTML += html;
}

/* ---------- 6. SCOPE: global, function and block ---------- */
function setupPage() {
  fillSelect("fType", uniqueValues("type"));
  fillSelect("fStatus", uniqueValues("status"));
  fillSelect("type", uniqueValues("type"));
  fillSelect("court", uniqueValues("court"));

  /* Numbers: values are calculated from the arrays. */
  el("statCases").textContent = cases.length;
  el("statCourts").textContent = uniqueValues("court").length;
  el("statLawyers").textContent = lawyers.length;

  /* reduce() adds all values of an array into one number. */
  const total = lawyers.reduce(function (sum, l) {
    return sum + l.exp;
  }, 0);
  const average = total / lawyers.length;      // arithmetic operators
  el("avgExp").textContent =
    "Average experience: " + average.toFixed(1) + " years";
}

/* ---------- 10. CONDITIONAL STATEMENTS ---------- */
function statusMessage(status) {
  switch (status) {                            // switch statement
    case "Pending":
      return "Waiting for the next hearing.";
    case "Hearing":
      return "Hearing is scheduled.";
    default:
      return "Case is closed.";
  }
}

/* ---------- 11. ARRAYS AND ARRAY OPERATIONS ---------- */
function caseCard(c) {
  return '<article class="card">' +
    '<span class="tag ' + c.status + '">' + c.status + "</span> " +
    '<span class="tag">' + c.type + "</span>" +
    "<h3>" + c.title + "</h3>" +
    "<p>" + c.id + "</p>" +
    "<p>" + c.court + "</p>" +
    "<p>Next hearing: " + formatDate(c.hearing) + "</p>" +
    '<button class="btn small" type="button" ' +
    "onclick=\"showCase('" + c.id + "')\">View details</button>" +
    "</article>";
}

function renderCases() {
  const text = el("q").value.trim().toLowerCase();   // string methods
  const type = el("fType").value;
  const status = el("fStatus").value;

  /* filter() keeps only the cases that match; && means AND, || means OR */
  const list = cases.filter(function (c) {
    const words = (c.id + " " + c.title + " " + c.court).toLowerCase();
    const textOk = text === "" || words.includes(text);
    const typeOk = type === "" || c.type === type;
    const statusOk = status === "" || c.status === status;
    return textOk && typeOk && statusOk;
  });

  el("count").textContent = list.length + " case(s) found";
  if (list.length > 0) {
    el("grid").innerHTML = list.map(caseCard).join("");   // map + join
  } else {
    el("grid").innerHTML = "<p>No matching cases.</p>";
  }
}

function showCase(id) {
  const c = cases.concat(mine).find(function (x) {
    return x.id === id;
  });
  el("detail").innerHTML =
    "<h3>" + c.title + "</h3>" +
    '<p><span class="tag ' + c.status + '">' + c.status + "</span> " +
    c.id + "</p>" +
    "<p><strong>Court:</strong> " + c.court + "<br>" +
    "<strong>Judge:</strong> " + c.judge + "<br>" +
    "<strong>Advocate:</strong> " + c.lawyer + "<br>" +
    "<strong>Next hearing:</strong> " + formatDate(c.hearing) + "<br>" +
    "<strong>Note:</strong> " + statusMessage(c.status) + "</p>";
  el("detail").hidden = false;
}

function renderHearings() {
  const upcoming = cases.filter(function (c) {
    return c.status !== "Disposed";            // !== means "not equal"
  });
  /* sort() orders the array; ISO dates compare correctly as text */
  upcoming.sort(function (a, b) {
    if (a.hearing < b.hearing) { return -1; }
    if (a.hearing > b.hearing) { return 1; }
    return 0;
  });
  el("hbody").innerHTML = upcoming.map(function (c) {
    return "<tr><td>" + c.id + "</td><td>" + c.title + "</td><td>" +
      c.court + "</td><td>" + formatDate(c.hearing) + "</td></tr>";
  }).join("");
}

function renderLawyers() {
  el("lgrid").innerHTML = lawyers.map(function (l) {
    const initial = l.name.split(" ")[1].charAt(0);   // "Simran" -> "S"
    return '<article class="card"><span class="av">' + initial + "</span>" +
      "<h3>" + l.name + "</h3><p>" + l.area + "</p><p>" + l.exp +
      " years' experience</p></article>";
  }).join("");
}

/* ---------- 8-9. STRINGS, NUMBERS AND BOOLEANS: validation ---------- */
function hasDigit(text) {
  const digits = text.split("").filter(function (ch) {
    return ch >= "0" && ch <= "9";
  });
  return digits.length > 0;                    // returns true or false
}

function validEmail(value) {
  const at = value.indexOf("@");               // position of "@" (-1 = none)
  const dot = value.lastIndexOf(".");          // position of the last "."
  return at > 0 && dot > at + 1 && dot < value.length - 1 &&
         !value.includes(" ");
}

/* Returns an error message, or "" when the field is correct. */
function getError(field) {
  const value = field.value.trim();
  switch (field.id) {
    case "name":
    case "cname":
      return value.length < 3 ? "Enter at least 3 characters." : "";
    case "email":
    case "cmail":
    case "lemail":
      if (value === "") { return "This field is required."; }
      return validEmail(value) ? "" : "Enter a valid email address.";
    case "phone":
      if (value.length !== 10 || isNaN(Number(value))) {
        return "Enter a valid 10-digit mobile number.";
      }
      return value.charAt(0) < "6" ? "Number must start with 6, 7, 8 or 9." : "";
    case "type":
    case "court":
      return value === "" ? "Please choose an option." : "";
    case "date":
      if (value === "") { return "Please select a date."; }
      return (value < "2025-01-01" || value > "2026-12-31") ?
        "Choose a date between 2025 and 2026." : "";
    case "desc":
      return value.length < 20 ? "Write at least 20 characters." : "";
    case "cmsg":
      return value.length < 10 ? "Write at least 10 characters." : "";
    case "ok":
      return field.checked ? "" : "Please tick to continue.";
    case "cn":
      if (value.toUpperCase().startsWith("OLCMS-2026-") &&
          value.length === 14 && !isNaN(Number(value.slice(11)))) {
        return "";
      }
      return "Use the format OLCMS-2026-001.";
    case "lpass":
      if (value.length < 8) { return "Password needs 8 or more characters."; }
      return hasDigit(value) ? "" : "Include at least one number.";
    default:
      return "";
  }
}

/* Checks every field in the list and shows the messages. */
function validateFields(ids) {
  let allGood = true;
  ids.forEach(function (id) {
    const field = el(id);
    const message = getError(field);
    el("err-" + id).textContent = message;
    field.className = message === "" ? "" : "bad";   // ternary operator
    if (message !== "") {
      allGood = false;       // inner function changes the outer variable
    }
  });
  return allGood;
}

function clearErrors(ids) {
  ids.forEach(function (id) {
    el("err-" + id).textContent = "";
    el(id).className = "";
  });
}

/* Validate a field again when the user leaves it (blur event). */
function watchFields(ids) {
  ids.forEach(function (id) {
    el(id).addEventListener("blur", function () {
      validateFields([id]);
    });
  });
}

/* ---------- FORMS ---------- */
const fileIds = ["name", "email", "phone", "type", "court", "date", "desc", "ok"];
const trackIds = ["cn"];
const contactIds = ["cname", "cmail", "cmsg"];
const loginIds = ["lemail", "lpass"];

function showMine() {
  if (mine.length === 0) {
    el("mine").innerHTML = "<li>Nothing filed yet.</li>";
    return;
  }
  el("mine").innerHTML = mine.map(function (m) {
    return "<li>" + m.id + " - " + m.title + " (" + m.status + ")</li>";
  }).join("");
}

function fileCase(event) {
  event.preventDefault();               // stop the page from reloading
  if (!validateFields(fileIds)) {
    el("fileOut").textContent = "";
    return;
  }
  const serial = String(cases.length + mine.length + 1).padStart(3, "0");
  const record = {                      // a new object
    id: "OLCMS-2026-" + serial,
    title: el("name").value.trim() + " - " + el("type").value,
    type: el("type").value,
    court: el("court").value,
    status: "Pending",
    hearing: "2026-12-15",
    judge: "To be assigned",
    lawyer: "To be assigned"
  };
  mine.push(record);
  showMine();
  el("fileOut").textContent =
    "Filed successfully. Your case number is " + record.id + ".";
  el("fileForm").reset();
  clearErrors(fileIds);
}

function trackCase(event) {
  event.preventDefault();
  if (!validateFields(trackIds)) {
    el("result").innerHTML = "";
    return;
  }
  const id = el("cn").value.trim().toUpperCase();
  const c = cases.concat(mine).find(function (x) {
    return x.id === id;
  });
  if (c) {
    el("result").innerHTML = '<div class="res"><h3>' + c.title + "</h3>" +
      '<p><span class="tag ' + c.status + '">' + c.status + "</span> " +
      c.court + "</p><p>Next hearing: <strong>" + formatDate(c.hearing) +
      "</strong> &middot; Judge: " + c.judge + "</p></div>";
  } else {
    el("result").innerHTML = '<div class="res"><p>No case found for ' + id +
      ". Try OLCMS-2026-001.</p></div>";
  }
}

function sendMessage(event) {
  event.preventDefault();
  if (!validateFields(contactIds)) {
    el("cOut").textContent = "";
    return;
  }
  el("cOut").textContent = "Thank you, " + el("cname").value.trim() +
    ". Your message has been recorded.";
  el("contactForm").reset();
  clearErrors(contactIds);
}

/* ---------- LOGIN ---------- */
function loginUser(event) {
  event.preventDefault();
  if (!validateFields(loginIds)) {
    el("loginOut").textContent = "";
    return;
  }
  currentUser = el("lemail").value.trim().split("@")[0];
  el("loginLink").textContent = "Logout (" + currentUser + ")";
  el("loginOut").textContent = "Welcome, " + currentUser +
    "! You are logged in.";
  el("loginForm").reset();
  clearErrors(loginIds);
}

function loginClick(event) {
  if (currentUser !== null) {           // already logged in -> log out
    event.preventDefault();
    currentUser = null;
    el("loginLink").textContent = "Login";
    el("loginOut").textContent = "You have been logged out.";
  }
}

/* ---------- THEME AND MENU ---------- */
function toggleTheme() {
  theme = theme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme);
  el("themeBtn").textContent = theme === "light" ? "Dark" : "Light";
}

function toggleMenu() {
  menuOpen = !menuOpen;                 // ! flips true/false
  el("nav").className = menuOpen ? "open" : "";
}

function closeMenu() {
  menuOpen = false;
  el("nav").className = "";
}

function heroSearch(event) {
  event.preventDefault();
  el("q").value = el("q0").value;
  renderCases();
  el("cases").scrollIntoView();
}

/* ---------- START: connect the functions to the page events ---------- */
setupPage();
renderCases();
renderHearings();
renderLawyers();

["q", "fType", "fStatus"].forEach(function (id) {
  el(id).addEventListener("input", renderCases);
});
el("heroSearch").addEventListener("submit", heroSearch);
el("fileForm").addEventListener("submit", fileCase);
el("trackForm").addEventListener("submit", trackCase);
el("contactForm").addEventListener("submit", sendMessage);
el("loginForm").addEventListener("submit", loginUser);
el("loginLink").addEventListener("click", loginClick);
el("themeBtn").addEventListener("click", toggleTheme);
el("menuBtn").addEventListener("click", toggleMenu);
document.querySelectorAll("nav a").forEach(function (link) {
  link.addEventListener("click", closeMenu);
});
el("showPw").addEventListener("change", function () {
  el("lpass").type = el("showPw").checked ? "text" : "password";
});

watchFields(fileIds);
watchFields(contactIds);
watchFields(loginIds);
watchFields(trackIds);

el("fileForm").addEventListener("reset", function () { clearErrors(fileIds); });
