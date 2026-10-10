import { BASE_PEOPLE, BASE_TREE } from "./data.js";
import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref as dbRef, get, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* ================= data ================= */
const clone = o => JSON.parse(JSON.stringify(o));
let PEOPLE = clone(BASE_PEOPLE);
let TREE = clone(BASE_TREE);

/* ================= helpers ================= */
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function textToHtml(text) {
  return String(text || "").split(/\n{2,}/).map(par => {
    const t = par.trim();
    if (!t) return "";
    return "<p>" + esc(t).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>") + "</p>";
  }).filter(Boolean).join("");
}
function htmlToText(html) {
  const div = document.createElement("div");
  div.innerHTML = html || "";
  div.querySelectorAll("strong,b").forEach(s => s.replaceWith(document.createTextNode("**" + s.textContent + "**")));
  const ps = [...div.querySelectorAll("p")].map(p => p.textContent.trim());
  const txt = ps.length ? ps.join("\n\n") : div.textContent.trim();
  return txt;
}

/* ================= card + render ================= */
function card(id) {
  const p = PEOPLE[id] || { name: id, gender: "male", initial: "?" };
  const btn = el("button", "person " + (p.gender === "female" ? "female" : "male") + (p.monarch ? " monarch" : ""));
  btn.type = "button";
  btn.dataset.id = id;
  if (p.badge && p.badge.icon) {
    const b = el("span", "badge", p.badge.icon);
    b.title = p.badge.title || "";
    btn.append(b);
  }
  const av = el("span", "avatar", p.initial || (p.name || "?").charAt(0).toUpperCase());
  if (p.img) {
    const im = document.createElement("img");
    im.src = p.img; im.alt = ""; im.loading = "lazy";
    av.textContent = ""; av.append(im); av.classList.add("has-photo");
    im.addEventListener("error", () => { av.classList.remove("has-photo"); av.textContent = p.initial || "?"; });
  }
  btn.append(av);
  btn.append(el("span", "p-name", p.name || id));
  if (p.dates) btn.append(el("span", "p-dates", p.dates));
  if (p.role) btn.append(el("span", "role", p.role));
  return btn;
}

function marriage(label) {
  const d = el("div", "marriage");
  d.setAttribute("aria-hidden", "true");
  d.append(el("span", null, label || "♥"));
  return d;
}

function coupleEl(node, s) {
  const c = el("div", "couple");
  const a = card(node.id), b = card(s.id);
  if (s.side === "left") c.append(b, marriage(s.married), a);
  else c.append(a, marriage(s.married), b);
  return c;
}

function marriageUnit(node, s) {
  const wrap = el("div", "unit");
  if (s.id == null) wrap.append(card(node.id));
  else wrap.append(coupleEl(node, s));
  if (s.children && s.children.length) {
    wrap.append(el("div", "stem grown"));
    wrap.append(siblingsRow(s.children));
  }
  return wrap;
}

function renderUnit(node) {
  const spouses = node.spouses || [];
  if (spouses.length === 0) return card(node.id);
  if (spouses.length === 1) return marriageUnit(node, spouses[0]);

  // Multiple spouses (only reachable for the root): repeat the person per spouse.
  const outer = el("div", "unit");
  if (node.note) outer.append(el("div", "couples-note", node.note));
  const row = el("div", "couples");
  spouses.forEach(s => {
    const cell = el("div", "couple-cell");
    cell.append(marriageUnit(node, s));
    row.append(cell);
  });
  outer.append(row);
  return outer;
}

function siblingsRow(children) {
  const row = el("div", "siblings");
  children.forEach(ch => {
    const spouses = ch.spouses || [];
    if (spouses.length > 1) {
      // repeat this person beside each spouse: one column per marriage
      spouses.forEach(s => {
        const col = el("div", "sib-col");
        col.append(marriageUnit(ch, s));
        if (col.querySelector(".couple")) col.classList.add("sib-wide");
        row.append(col);
      });
    } else {
      const col = el("div", "sib-col");
      col.append(renderUnit(ch));
      if (col.querySelector(".couple")) col.classList.add("sib-wide");
      row.append(col);
    }
  });
  return row;
}

function renderTree() {
  const section = el("section", "gen1");
  section.append(renderUnit(TREE));
  canvas.replaceChildren(section);
  if (editMode) canvas.classList.add("editing"); else canvas.classList.remove("editing");
  fit();
}

/* ================= tree helpers ================= */
function locate(id) {
  const seen = new Set();
  function walk(node) {
    if (!node || seen.has(node)) return null;
    seen.add(node);
    if (node.id === id) return { kind: "node", obj: node };
    for (const sp of node.spouses || []) {
      if (sp.id === id) return { kind: "spouse", obj: sp, node };
      for (const ch of sp.children || []) {
        const r = walk(ch); if (r) return r;
      }
    }
    return null;
  }
  return walk(TREE);
}

function removeFromTree(id) {
  function scrub(list) {
    for (let i = list.length - 1; i >= 0; i--) {
      const node = list[i];
      if (node.id === id) { list.splice(i, 1); continue; }
      for (const sp of node.spouses || []) {
        if (sp.id === id) { sp.id = null; continue; }
        if (sp.children) scrub(sp.children);
      }
    }
  }
  if (TREE.spouses) {
    for (const sp of TREE.spouses) {
      if (sp.id === id) { sp.id = null; continue; }
      if (sp.children) scrub(sp.children);
    }
  }
}

function prunePeople() {
  const keep = new Set();
  (function walk(node) {
    if (!node || keep.has(node.id)) return;
    keep.add(node.id);
    for (const sp of node.spouses || []) {
      if (sp.id != null) keep.add(sp.id);
      (sp.children || []).forEach(walk);
    }
  })(TREE);
  for (const k of Object.keys(PEOPLE)) if (!keep.has(k)) delete PEOPLE[k];
}

/* ================= viewport / canvas ================= */
const viewport = document.getElementById("viewport");
const canvas = document.getElementById("canvas");
let scale = 1, tx = 0, ty = 0;
const MIN_S = 0.25, MAX_S = 2.5;

function apply() { canvas.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`; }
function fit() {
  const vw = viewport.clientWidth;
  const cw = canvas.offsetWidth, ch = canvas.offsetHeight;
  if (!cw || !ch) return;
  scale = Math.min(1, Math.max(MIN_S, (vw - 32) / cw));
  tx = (vw - cw * scale) / 2;
  ty = 10;
  apply();
}
function zoomAt(mx, my, factor) {
  const ns = Math.min(MAX_S, Math.max(MIN_S, scale * factor));
  const k = ns / scale;
  tx = mx - (mx - tx) * k;
  ty = my - (my - ty) * k;
  scale = ns; apply();
}
document.getElementById("zoom-in").addEventListener("click", () => zoomAt(viewport.clientWidth / 2, viewport.clientHeight / 2, 1.2));
document.getElementById("zoom-out").addEventListener("click", () => zoomAt(viewport.clientWidth / 2, viewport.clientHeight / 2, 1 / 1.2));
document.getElementById("zoom-reset").addEventListener("click", fit);
viewport.addEventListener("wheel", e => {
  e.preventDefault();
  const r = viewport.getBoundingClientRect();
  zoomAt(e.clientX - r.left, e.clientY - r.top, e.deltaY < 0 ? 1.12 : 1 / 1.12);
}, { passive: false });

let dragging = false, dragMoved = false, startX = 0, startY = 0, startTx = 0, startTy = 0;
viewport.addEventListener("pointerdown", e => {
  if (e.pointerType === "mouse" && e.button !== 0) return;
  dragging = true; dragMoved = false;
  startX = e.clientX; startY = e.clientY; startTx = tx; startTy = ty;
  viewport.classList.add("dragging");
});
window.addEventListener("pointermove", e => {
  if (!dragging) return;
  const dx = e.clientX - startX, dy = e.clientY - startY;
  if (Math.abs(dx) > 5 || Math.abs(dy) > 5) dragMoved = true;
  tx = startTx + dx; ty = startTy + dy; apply();
});
function endDrag() { if (dragging) { dragging = false; viewport.classList.remove("dragging"); } }
window.addEventListener("pointerup", endDrag);
window.addEventListener("pointercancel", endDrag);
window.addEventListener("resize", fit);
window.addEventListener("load", fit);

/* ================= modal ================= */
const overlay = document.getElementById("modal-overlay");
const modalClose = document.getElementById("modal-close");
let lastFocused = null;

function openModal(id) {
  const p = PEOPLE[id];
  if (!p) return;
  lastFocused = document.activeElement;
  const av = document.getElementById("modal-avatar");
  av.className = "modal-avatar " + (p.gender === "female" ? "female" : "male");
  av.textContent = p.initial || (p.name || "?").charAt(0).toUpperCase();
  if (p.img) {
    const im = document.createElement("img");
    im.src = p.img; im.alt = "";
    av.textContent = ""; av.append(im); av.classList.add("has-photo");
    im.addEventListener("error", () => { av.classList.remove("has-photo"); av.textContent = p.initial || "?"; });
  }
  document.getElementById("modal-title").textContent = p.name || id;
  document.getElementById("modal-sub").textContent = p.sub || "";
  const tags = document.getElementById("modal-tags");
  tags.innerHTML = "";
  (p.tags || []).forEach(t => tags.appendChild(el("span", null, t)));
  document.getElementById("modal-body").innerHTML = p.body || "";
  document.querySelectorAll(".person.focused").forEach(e => e.classList.remove("focused"));
  const c = document.querySelector(`.person[data-id="${id}"]`);
  if (c) c.classList.add("focused");
  overlay.hidden = false;
  modalClose.focus();
}
function closeModal() {
  overlay.hidden = true;
  document.querySelectorAll(".person.focused").forEach(e => e.classList.remove("focused"));
  if (lastFocused) lastFocused.focus();
}
modalClose.addEventListener("click", closeModal);
overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if (!overlay.hidden) closeModal();
  else if (!edOverlay.hidden) closeEditor();
  else if (!authOverlay.hidden) closeAuth();
});

/* ================= card clicks (delegation) ================= */
canvas.addEventListener("click", e => {
  const btn = e.target.closest(".person");
  if (!btn || dragMoved) return;
  if (editMode && isAdmin) openEditor(btn.dataset.id);
  else openModal(btn.dataset.id);
});

/* ================= firebase ================= */
let db = null, auth = null;
let isAdmin = false, editMode = false;
const hasFirebase = firebaseConfig && firebaseConfig.apiKey && !String(firebaseConfig.apiKey).startsWith("PASTE");

function initFirebase() {
  if (!hasFirebase) return;
  const app = initializeApp(firebaseConfig);
  db = getDatabase(app);
  auth = getAuth(app);
  onAuthStateChanged(auth, user => {
    isAdmin = !!user;
    if (!user && editMode) { editMode = false; updateEditUI(); }
    updateAccountUI(user);
  });
}

async function loadData() {
  if (!db) return;
  try {
    const snap = await get(dbRef(db, "tree"));
    const v = snap.val();
    if (v && v.people && v.layout) {
      PEOPLE = v.people;
      TREE = v.layout;
    }
  } catch (e) { console.warn("Could not load saved tree:", e.message); }
}

async function saveData() {
  if (!db || !isAdmin) throw new Error("Not signed in");
  await set(dbRef(db, "tree"), { people: PEOPLE, layout: TREE });
}

function resizePhoto(file, max = 360) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Impossibile leggere il file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Immagine non valida"));
      img.onload = () => {
        const s = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * s));
        const h = Math.max(1, Math.round(img.height * s));
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        const ctx = c.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        let url = c.toDataURL("image/webp", 0.82);
        if (!url.startsWith("data:image/webp")) url = c.toDataURL("image/jpeg", 0.82);
        resolve(url);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

/* ================= auth UI ================= */
const authOverlay = document.getElementById("auth-overlay");
const authStatus = document.getElementById("auth-status");
const authBtn = document.getElementById("account-btn");
const editBtn = document.getElementById("edit-btn");

function updateAccountUI(user) {
  authBtn.textContent = user ? "👤 Admin" : "👤 Sign in";
  authBtn.classList.toggle("active", !!user);
  document.getElementById("auth-form").hidden = !!user;
  document.getElementById("auth-signedin").hidden = !user;
  if (user) document.getElementById("auth-user").textContent = user.email || "admin";
}
function openAuth() {
  authStatus.textContent = "";
  authOverlay.hidden = false;
  if (!isAdmin) document.getElementById("auth-email").focus();
}
function closeAuth() { authOverlay.hidden = true; }
authBtn.addEventListener("click", openAuth);
document.getElementById("auth-close").addEventListener("click", closeAuth);
authOverlay.addEventListener("click", e => { if (e.target === authOverlay) closeAuth(); });
document.getElementById("auth-form").addEventListener("submit", async e => {
  e.preventDefault();
  if (!hasFirebase || !auth) { authStatus.textContent = "Firebase non configurato."; return; }
  authStatus.textContent = "Signing in…";
  try {
    await signInWithEmailAndPassword(auth, document.getElementById("auth-email").value.trim(), document.getElementById("auth-pass").value);
    authStatus.textContent = "";
    closeAuth();
  } catch (err) {
    authStatus.textContent = "Errore: " + err.message;
  }
});
document.getElementById("auth-signout").addEventListener("click", async () => {
  if (auth) await signOut(auth);
  closeAuth();
});

function updateEditUI() {
  editBtn.classList.toggle("active", editMode);
  editBtn.textContent = editMode ? "✏️ Editing…" : "✏️ Edit";
  document.body.classList.toggle("edit-mode", editMode);
  renderTree();
}
editBtn.addEventListener("click", () => {
  if (!isAdmin) { openAuth(); return; }
  editMode = !editMode;
  updateEditUI();
});

/* ================= editor ================= */
const edOverlay = document.getElementById("ed-overlay");
const edStatus = document.getElementById("ed-status");
let editingId = null, newPhoto = null;

function openEditor(id) {
  const p = PEOPLE[id];
  if (!p) return;
  editingId = id; newPhoto = null;
  document.getElementById("ed-title").textContent = "Edit: " + (p.name || id);
  document.getElementById("ed-name").value = p.name || "";
  document.getElementById("ed-dates").value = p.dates || "";
  document.getElementById("ed-role").value = p.role || "";
  document.getElementById("ed-sub").value = p.sub || "";
  document.getElementById("ed-body").value = htmlToText(p.body || "");
  document.getElementById("ed-tags").value = (p.tags || []).join(", ");
  document.getElementById("ed-badge-icon").value = (p.badge && p.badge.icon) || "";
  document.getElementById("ed-badge-title").value = (p.badge && p.badge.title) || "";
  document.getElementById("ed-monarch").checked = !!p.monarch;
  document.querySelector(`input[name="ed-gender"][value="${p.gender === "female" ? "female" : "male"}"]`).checked = true;
  const prev = document.getElementById("ed-photo-preview");
  prev.innerHTML = p.img ? `<img src="${esc(p.img)}" alt="">` : "<span>no photo</span>";
  document.getElementById("ed-remove-photo").checked = false;
  document.getElementById("ed-photo").value = "";
  edStatus.textContent = "";
  edOverlay.hidden = false;
}
function closeEditor() { edOverlay.hidden = true; }
document.getElementById("ed-close").addEventListener("click", closeEditor);
edOverlay.addEventListener("click", e => { if (e.target === edOverlay) closeEditor(); });
document.getElementById("ed-photo").addEventListener("change", async e => {
  const file = e.target.files[0] || null;
  newPhoto = null;
  const prev = document.getElementById("ed-photo-preview");
  if (!file) return;
  prev.innerHTML = "<span>Processing…</span>";
  try {
    newPhoto = await resizePhoto(file);
    prev.innerHTML = `<img src="${newPhoto}" alt="">`;
    document.getElementById("ed-remove-photo").checked = false;
  } catch (err) {
    newPhoto = null;
    prev.innerHTML = "<span>Error</span>";
    edStatus.textContent = "Errore: " + err.message;
  }
});

document.getElementById("ed-form").addEventListener("submit", async e => {
  e.preventDefault();
  const p = PEOPLE[editingId];
  if (!p) return;
  edStatus.textContent = "Saving…";
  try {
    p.name = document.getElementById("ed-name").value.trim();
    p.dates = document.getElementById("ed-dates").value.trim();
    p.role = document.getElementById("ed-role").value.trim();
    p.sub = document.getElementById("ed-sub").value.trim();
    p.body = textToHtml(document.getElementById("ed-body").value);
    p.tags = document.getElementById("ed-tags").value.split(",").map(s => s.trim()).filter(Boolean);
    p.gender = document.querySelector('input[name="ed-gender"]:checked').value;
    p.monarch = document.getElementById("ed-monarch").checked;
    const icon = document.getElementById("ed-badge-icon").value.trim();
    const btitle = document.getElementById("ed-badge-title").value.trim();
    if (icon) p.badge = { icon, title: btitle }; else delete p.badge;
    p.initial = (p.name || "?").charAt(0).toUpperCase();
    if (document.getElementById("ed-remove-photo").checked) delete p.img;
    if (newPhoto) p.img = newPhoto;
    await saveData();
    renderTree();
    closeEditor();
  } catch (err) {
    edStatus.textContent = "Errore: " + err.message;
  }
});

document.getElementById("ed-add-child").addEventListener("click", async () => {
  const name = prompt("Nome del nuovo familiare (figlio/a):");
  if (!name) return;
  const newId = "p" + Date.now();
  PEOPLE[newId] = { name, gender: "male", initial: name.charAt(0).toUpperCase(), dates: "", role: "", tags: [], sub: "", body: "" };
  const child = { id: newId, spouses: [] };
  const loc = locate(editingId);
  if (loc && loc.kind === "spouse") {
    loc.obj.children = loc.obj.children || []; loc.obj.children.push(child);
  } else if (loc) {
    const node = loc.obj; node.spouses = node.spouses || [];
    if (node.spouses.length === 0) node.spouses.push({ id: null, children: [child] });
    else { node.spouses[0].children = node.spouses[0].children || []; node.spouses[0].children.push(child); }
  } else {
    TREE.spouses = TREE.spouses || [];
    if (TREE.spouses.length === 0) TREE.spouses.push({ id: null, children: [child] });
    else { TREE.spouses[0].children = TREE.spouses[0].children || []; TREE.spouses[0].children.push(child); }
  }
  try { await saveData(); } catch (err) { edStatus.textContent = "Errore: " + err.message; }
  renderTree();
  openEditor(newId);
});

document.getElementById("ed-add-spouse").addEventListener("click", async () => {
  const name = prompt("Nome del coniuge:");
  if (!name) return;
  const newId = "p" + Date.now();
  PEOPLE[newId] = { name, gender: "female", initial: name.charAt(0).toUpperCase(), dates: "", role: "", tags: [], sub: "", body: "" };
  const loc = locate(editingId);
  const node = loc ? (loc.kind === "node" ? loc.obj : loc.node) : TREE;
  node.spouses = node.spouses || [];
  const single = node.spouses.length === 1 && node.spouses[0].id == null ? node.spouses[0] : null;
  if (single) single.id = newId;
  else node.spouses.push({ id: newId, children: [] });
  try { await saveData(); } catch (err) { edStatus.textContent = "Errore: " + err.message; }
  renderTree();
  openEditor(newId);
});

document.getElementById("ed-delete").addEventListener("click", async () => {
  if (editingId === TREE.id) { edStatus.textContent = "Non puoi eliminare la radice."; return; }
  if (!confirm("Eliminare questa persona?")) return;
  delete PEOPLE[editingId];
  removeFromTree(editingId);
  prunePeople();
  try { await saveData(); } catch (err) { edStatus.textContent = "Errore: " + err.message; }
  renderTree();
  closeEditor();
});

/* ================= boot ================= */
initFirebase();
updateAccountUI(null);
renderTree();
loadData().then(renderTree).catch(() => {});
