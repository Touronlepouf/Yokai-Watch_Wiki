let allAnimes = [];

fetch("data/anime.json")
  .then(res => res.json())
  .then(data => {
    allAnimes = data;
    displayAnime(allAnimes);
    setupFilters();
  });

function setupFilters() {
  const buttons = document.querySelectorAll(".filters button");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      if (filter === "all") {
        displayAnime(allAnimes);
      } else {
        displayAnime(allAnimes.filter(a => a.type === filter));
      }
    });
  });
}

function displayAnime(animes) {
  const container = document.getElementById("anime-list");
  container.innerHTML = "";

  if (animes.length === 0) {
    container.innerHTML = "<p>Aucun résultat</p>";
    return;
  }

  animes.forEach(anime => {
    container.innerHTML += `
      <div class="anime-card">
        <img src="images/anime/${anime.image}" alt="${anime.title}">
        
        <div class="anime-info">
          <h2>${anime.title}</h2>
          <p><strong>Date :</strong> ${anime.release}</p>

          ${
            anime.type === "serie"
              ? `<p><strong>Saisons :</strong> ${anime.seasons}</p>`
              : `<p><strong>Durée :</strong> ${anime.duration}</p>`
          }

          <p><strong>Pays :</strong> ${anime.countries.join(", ")}</p>
          <p>${anime.description}</p>
        </div>
      </div>
    `;
  });
}
