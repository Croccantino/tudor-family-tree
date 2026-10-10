import { firebaseConfig } from "./firebase-config.js";

const SDK = "https://www.gstatic.com/firebasejs/10.12.2";

const configured =
  firebaseConfig &&
  firebaseConfig.apiKey && !String(firebaseConfig.apiKey).startsWith("PASTE") &&
  firebaseConfig.projectId && !String(firebaseConfig.projectId).startsWith("PASTE");

const overlay = document.getElementById("gb-overlay");
const openBtn = document.getElementById("guestbook-btn");
const closeBtn = document.getElementById("gb-close");
const form = document.getElementById("gb-form");
const nameInput = document.getElementById("gb-name");
const textInput = document.getElementById("gb-text");
const hp = document.getElementById("gb-hp");
const count = document.getElementById("gb-count");
const statusEl = document.getElementById("gb-status");
const list = document.getElementById("gb-list");
const submitBtn = document.getElementById("gb-submit");

let fb = null; // { add(data) }

/* ---------- open / close ---------- */
function openGB() {
  overlay.hidden = false;
  closeBtn.focus();
}
function closeGB() {
  overlay.hidden = true;
  openBtn.focus();
}
openBtn.addEventListener("click", openGB);
closeBtn.addEventListener("click", closeGB);
overlay.addEventListener("click", e => { if (e.target === overlay) closeGB(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !overlay.hidden) closeGB(); });

textInput.addEventListener("input", () => {
  count.textContent = textInput.value.length + " / 280";
});

/* ---------- helpers ---------- */
function relTime(ts) {
  let date = null;
  if (ts && typeof ts.toDate === "function") date = ts.toDate();
  else if (ts instanceof Date) date = ts;
  else if (typeof ts === "number") date = new Date(ts);
  if (!date) return "just now";
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60); if (m < 60) return m + " min ago";
  const h = Math.floor(m / 60); if (h < 24) return h + " h ago";
  const d = Math.floor(h / 24); if (d < 7) return d + " d ago";
  return date.toLocaleDateString();
}

function renderItem(data) {
  const li = document.createElement("li");
  li.className = "gb-item";
  const who = document.createElement("div");
  who.className = "who";
  const n = document.createElement("span");
  n.textContent = data.name || "Anonymous";
  const t = document.createElement("time");
  t.textContent = relTime(data.createdAt);
  who.append(n, t);
  const m = document.createElement("div");
  m.className = "msg";
  m.textContent = data.text || "";
  li.append(who, m);
  return li;
}

/* ---------- firebase ---------- */
async function initFirebase() {
  const [{ initializeApp }, fs] = await Promise.all([
    import(SDK + "/firebase-app.js"),
    import(SDK + "/firebase-firestore.js")
  ]);

  const app = initializeApp(firebaseConfig);
  const db = fs.getFirestore(app);
  const messages = fs.collection(db, "messages");

  const q = fs.query(messages, fs.orderBy("createdAt", "desc"), fs.limit(50));
  fs.onSnapshot(q, snap => {
    list.innerHTML = "";
    if (snap.empty) {
      const li = document.createElement("li");
      li.className = "gb-empty";
      li.textContent = "No messages yet — be the first!";
      list.appendChild(li);
      return;
    }
    snap.forEach(doc => list.appendChild(renderItem(doc.data())));
  }, err => {
    const li = document.createElement("li");
    li.className = "gb-empty";
    li.textContent = "Could not load messages: " + err.message;
    list.innerHTML = "";
    list.appendChild(li);
  });

  return {
    add: data => fs.addDoc(messages, data),
    serverTimestamp: fs.serverTimestamp
  };
}

/* ---------- submit ---------- */
form.addEventListener("submit", async e => {
  e.preventDefault();
  if (!fb) {
    statusEl.className = "gb-status";
    statusEl.textContent = "Guestbook is not configured yet.";
    return;
  }
  if (hp.value) return; // honeypot: silently ignore bots

  const name = nameInput.value.trim();
  const text = textInput.value.trim();
  if (!name || !text) {
    statusEl.className = "gb-status";
    statusEl.textContent = "Please fill in both your name and a message.";
    return;
  }

  const last = Number(localStorage.getItem("gb_last") || 0);
  if (Date.now() - last < 15000) {
    statusEl.className = "gb-status";
    statusEl.textContent = "Please wait a few seconds before posting again.";
    return;
  }

  submitBtn.disabled = true;
  statusEl.className = "gb-status";
  statusEl.textContent = "Sending…";
  try {
    await fb.add({
      name: name.slice(0, 40),
      text: text.slice(0, 280),
      createdAt: fb.serverTimestamp()
    });
    localStorage.setItem("gb_last", Date.now());
    form.reset();
    count.textContent = "0 / 280";
    statusEl.className = "gb-status ok";
    statusEl.textContent = "Thanks! Your message is posted.";
  } catch (err) {
    statusEl.className = "gb-status";
    statusEl.textContent = "Error: " + err.message;
  } finally {
    submitBtn.disabled = false;
  }
});

/* ---------- boot ---------- */
if (!configured) {
  submitBtn.disabled = true;
  nameInput.disabled = true;
  textInput.disabled = true;
  list.innerHTML = "";
  const li = document.createElement("li");
  li.className = "gb-empty";
  li.textContent = "Guestbook not set up yet.";
  list.appendChild(li);
  statusEl.className = "gb-status";
  statusEl.textContent = "Add your Firebase config in firebase-config.js to enable posting.";
} else {
  initFirebase()
    .then(api => { fb = api; })
    .catch(err => {
      statusEl.className = "gb-status";
      statusEl.textContent = "Firebase error: " + err.message;
    });
}
