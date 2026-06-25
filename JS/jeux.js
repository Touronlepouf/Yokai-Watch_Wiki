let allJeux = [];

fetch("data/jeux.json")
  .then(res => res.json())
  .then(jeux => {
    allJeux = jeux.sort((a, b) => a.id - b.id);
    displayGames(allJeux);
    setupFilters();
  });

function displayGames(jeux) {
  const container = document.getElementById("games-container");
  container.innerHTML = "";

  jeux.forEach(jeu => {
    const game = document.createElement("div");
    game.className = "game-card";

    game.innerHTML = `
      <img src="images/games/${jeu.image}" alt="${jeu.nom}" class="game-img">

      <div class="game-info">
        <h2>${jeu.nom}</h2>

        <ul>
          <li>Plateforme :<strong> ${jeu.platform.toUpperCase()}</strong></li>
          <li>📅 Date de sortie : <strong>${jeu.date_sortie}</strong></li>
          <li>💿 Physique : <strong>${jeu.prix_physique}</strong></li>
          <li>💾 Dématérialisé : <strong>${jeu.prix_demat}</strong></li>
          <li>👻 Yo-kai : <strong>${jeu.nb_yokai}</strong></li>
          <li>📦 DLC : <strong>${jeu.dlc ? "Oui" : "Non"}</strong></li>
          <li>🌍 Pays : <strong>${jeu.pays.join(", ")}</strong></li>
          <li>${jeu.accessible ? "🟢 Accessible" : "🔴 Indisponible"}</li>
        </ul>

        <p>${jeu.description}</p>
      </div>
    `;

    container.appendChild(game);
  });
}

function setupFilters() {
  const buttons = document.querySelectorAll(".filters button");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      if (filter === "all") {
        displayGames(allJeux);
      } else {
        displayGames(allJeux.filter(jeu => jeu.platform === filter));
      }
    });
  });
}
