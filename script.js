const container = document.getElementById("map-container");
const markersContainer = document.getElementById("markers");

let markers = JSON.parse(localStorage.getItem("markers")) || [];
let scale = 1;
let pos = { x: 0, y: 0 };

function saveMarkers() {
  localStorage.setItem("markers", JSON.stringify(markers));
}

function updateTransform() {
  container.style.transform =
    `translate(${pos.x}px, ${pos.y}px) scale(${scale})`;
}

function renderMarkers() {
  markersContainer.innerHTML = "";

  markers.forEach((marker, index) => {
    const m = document.createElement("div");
    m.className = "marker";
    m.style.left = marker.x + "px";
    m.style.top = marker.y + "px";

    m.onclick = (e) => {
      e.stopPropagation();
      showNote(marker, index);
    };

    markersContainer.appendChild(m);
  });
}

function showNote(marker, index) {
  document.querySelectorAll(".note").forEach(n => n.remove());

  const note = document.createElement("div");
  note.className = "note";
  note.style.left = marker.x + "px";
  note.style.top = marker.y + "px";

  const textarea = document.createElement("textarea");
  textarea.value = marker.text;

  textarea.oninput = (e) => {
    markers[index].text = e.target.value;
    saveMarkers();
  };

  note.appendChild(textarea);
  markersContainer.appendChild(note);
}

container.addEventListener("click", (e) => {
  const rect = container.getBoundingClientRect();
  const x = (e.clientX - rect.left);
  const y = (e.clientY - rect.top);

  markers.push({ x, y, text: "" });
  saveMarkers();
  renderMarkers();
});

container.addEventListener("wheel", (e) => {
  e.preventDefault();
  scale += e.deltaY * -0.001;
  scale = Math.min(Math.max(0.5, scale), 3);
  updateTransform();
});

let isDragging = false;
let start = { x: 0, y: 0 };

container.addEventListener("mousedown", (e) => {
  isDragging = true;
  start = { x: e.clientX - pos.x, y: e.clientY - pos.y };
});

window.addEventListener("mouseup", () => isDragging = false);

window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  pos.x = e.clientX - start.x;
  pos.y = e.clientY - start.y;
  updateTransform();
});

renderMarkers();
updateTransform();
