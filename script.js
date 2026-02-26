const map = document.getElementById("map");
const markersContainer = document.getElementById("markers");

let markers = JSON.parse(localStorage.getItem("markers")) || [];

function saveMarkers() {
  localStorage.setItem("markers", JSON.stringify(markers));
}

function renderMarkers() {
  markersContainer.innerHTML = "";

  markers.forEach((marker, index) => {
    const markerEl = document.createElement("div");
    markerEl.className = "marker";
    markerEl.style.left = marker.x + "%";
    markerEl.style.top = marker.y + "%";

    markerEl.addEventListener("click", () => {
      showNote(marker, index);
    });

    markersContainer.appendChild(markerEl);
  });
}

function showNote(marker, index) {
  const noteEl = document.createElement("div");
  noteEl.className = "note";
  noteEl.style.left = marker.x + "%";
  noteEl.style.top = marker.y + "%";

  const textarea = document.createElement("textarea");
  textarea.value = marker.text;

  textarea.addEventListener("input", (e) => {
    markers[index].text = e.target.value;
    saveMarkers();
  });

  noteEl.appendChild(textarea);
  markersContainer.appendChild(noteEl);

  setTimeout(() => {
    document.addEventListener("click", () => {
      noteEl.remove();
    }, { once: true });
  }, 100);
}

map.addEventListener("click", (e) => {
  const rect = map.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;

  markers.push({ x, y, text: "" });
  saveMarkers();
  renderMarkers();
});

renderMarkers();
