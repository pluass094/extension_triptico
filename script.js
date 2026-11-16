/* Imágenes de portada (una por libro). Ejemplo: "img/tula.jpg". Vacío = sin imagen. */
const PORTADA = { tula: "", bodas: "" };
for (const k of ["tula", "bodas"]) {
  document.querySelector(".lado." + k).style.setProperty("--foto", PORTADA[k] ? `url("${PORTADA[k]}")` : "none");
}

/* Divisor de la portada */
const split = document.getElementById("inicio");
const asa = document.getElementById("asa");
const pista = document.getElementById("pista");
let arrastrando = false;
function mover(pct) {
  pct = Math.max(0, Math.min(100, pct));
  split.style.setProperty("--split", pct + "%");
  asa.setAttribute("aria-valuenow", Math.round(pct));
  pista.classList.add("oculta");
}
function desdeEvento(e) {
  const r = split.getBoundingClientRect();
  mover(((e.clientX - r.left) / r.width) * 100);
}
split.addEventListener("pointerdown", e => { if (e.target.closest(".comenzar")) return; arrastrando = true; desdeEvento(e); });
window.addEventListener("pointerup", () => (arrastrando = false));
split.addEventListener("pointermove", e => { if (arrastrando || e.pointerType === "mouse") desdeEvento(e); });
asa.addEventListener("keydown", e => {
  const a = +asa.getAttribute("aria-valuenow");
  if (e.key === "ArrowLeft") mover(a - 5);
  if (e.key === "ArrowRight") mover(a + 5);
});

/* Pestañas (capítulos y análisis) */
document.querySelectorAll(".tabs").forEach(grupo => {
  const botones = grupo.querySelectorAll("[role=tab]");
  botones.forEach(b => b.addEventListener("click", () => {
    botones.forEach(x => x.setAttribute("aria-selected", x === b));
    grupo.querySelectorAll(".panel").forEach(p => (p.hidden = p.id !== b.dataset.p));
  }));
});

/* Si una imagen no existe aún, muestra un recuadro en su lugar */
function marcador(img) {
  const d = document.createElement("div");
  d.className = "vacia " + img.className;
  d.textContent = "Imagen pendiente: " + (img.dataset.ph || "");
  img.replaceWith(d);
}
document.querySelectorAll("img[data-ph]").forEach(img => {
  if (img.complete && img.naturalWidth === 0) marcador(img);
  else img.addEventListener("error", () => marcador(img));
});

/* Actividad: identifica los símbolos */
document.getElementById("comprobar").addEventListener("click", () => {
  const sets = document.querySelectorAll("#actividad fieldset");
  let bien = 0, sin = 0;
  sets.forEach(f => {
    f.classList.remove("bien", "mal");
    const sel = f.querySelector("input:checked");
    if (!sel) { sin++; return; }
    if (sel.value === "ok") { bien++; f.classList.add("bien"); } else f.classList.add("mal");
  });
  document.getElementById("resultado").textContent = sin
    ? `Te faltan ${sin} por responder.`
    : `Respuestas correctas: ${bien} de ${sets.length}.` + (bien === sets.length ? " ¡Excelente!" : " Revisa las marcadas en rojo.");
});

/* Cambio de libro */
const libros = { tula: document.getElementById("libro-tula"), bodas: document.getElementById("libro-bodas") };
function elegirLibro(k, ir) {
  const pre = k === "bodas" ? "b-" : "";
  document.body.dataset.libro = k;
  libros.tula.hidden = k !== "tula";
  libros.bodas.hidden = k !== "bodas";
  document.querySelectorAll(".sel button").forEach(b => b.setAttribute("aria-pressed", b.dataset.libro === k));
  document.querySelectorAll(".menu [data-s]").forEach(a => {
    a.setAttribute("href", "#" + (a.dataset.s === "inicio" ? "inicio" : pre + a.dataset.s));
  });
  document.title = k === "bodas" ? "Bodas de sangre · Extensión digital del tríptico" : "La tía Tula: maternidad, identidad, familia y trascendencia";
  if (ir) document.getElementById(pre + "presentacion").scrollIntoView();
}
document.querySelectorAll(".sel button, .comenzar").forEach(b => b.addEventListener("click", () => elegirLibro(b.dataset.libro, true)));
document.body.dataset.libro = "tula";

/* Actividad de símbolos de Bodas de sangre */
document.getElementById("comprobar-b").addEventListener("click", () => {
  const sets = document.querySelectorAll("#actividad-b fieldset");
  let bien = 0, sin = 0;
  sets.forEach(f => {
    f.classList.remove("bien", "mal");
    const sel = f.querySelector("input:checked");
    if (!sel) { sin++; return; }
    if (sel.value === "ok") { bien++; f.classList.add("bien"); } else f.classList.add("mal");
  });
  document.getElementById("resultado-b").textContent = sin
    ? `Te faltan ${sin} por responder.`
    : `Respuestas correctas: ${bien} de ${sets.length}.` + (bien === sets.length ? " ¡Excelente!" : " Revisa las marcadas en rojo.");
});