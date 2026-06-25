let maps = [];
let currentWorld = "all";

fetch("data/maps.json")
  .then(res => res.json())
  .then(data => {
    maps = data;
    displayMaps();
  });

function displayMaps() {

  const container = document.getElementById("map-container");
  container.innerHTML = "";

  const filtered = maps.filter(map => {
    if (currentWorld === "all") return true;
    return map.world === currentWorld;
  });

const filterButtons = document.querySelectorAll(".filters button");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {

    // enlève active sur tous les boutons
    filterButtons.forEach(btn => btn.classList.remove("active"));

    // ajoute active sur celui cliqué
    button.classList.add("active");

  });
});

  filtered.forEach(map => {

    const card = document.createElement("div");
    card.className = "map-card";

    card.innerHTML = `
      <img src="images/maps/${map.image}" alt="${map.name}" class="map-img">

      <div class="map-info">
        <h2>🗺️ ${map.name}</h2>

        <ul>
          <li>📍 Type : <strong>${map.type}</strong></li>
          <li>🎮 Apparition pour la première fois dans  : <strong>${map.game}</strong></li>
          <li>🌍 Monde : <strong>${map.world}</strong></li>
        </ul>

        <p>${map.description}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

function filterWorld(world) {
  currentWorld = world;
  displayMaps();
}