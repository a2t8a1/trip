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

    markerEl.addEventListener("click", (e) => {
      e.stopPropagation();
      showNote(marker, index);
    });

    markersContainer.appendChild(markerEl);
  });
}

function showNote(marker, index) {
  document.querySelectorAll(".note").forEach(n => n.remove());

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

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Sil";
  deleteBtn.onclick = () => {
    markers.splice(index, 1);
    saveMarkers();
    renderMarkers();
    noteEl.remove();
  };

  noteEl.appendChild(textarea);
  noteEl.appendChild(deleteBtn);
  markersContainer.appendChild(noteEl);
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
