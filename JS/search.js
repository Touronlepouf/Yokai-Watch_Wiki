// ================================
// VARIABLES GLOBALES
// ================================
let allYokai = [];
let currentTribe = "all";
let currentRarity = "all";
let currentRank = "all";
let searchTerm = "";

let loaderTimeout = null;
let loaderVisible = false;
let loaderStartTime = 0;
const MIN_LOADER_TIME = 200; // durée minimale d'affichage (anti flash)

// ================================
// NORMALISATION (ANTI BUG)
// ================================
function normalize(str) {
  if (!str) return "";
  return str
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

// ================================
// LOADER
// ================================
function showLoaderDelayed() {
  const loader = document.getElementById("loader");
  if (!loader) return;

  loaderStartTime = Date.now();

  loaderTimeout = setTimeout(() => {
    loader.classList.remove("hidden");
    loaderVisible = true;
  }, 150); // délai avant apparition (anti flash)
}

function hideLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;

  clearTimeout(loaderTimeout);

  const elapsed = Date.now() - loaderStartTime;
  const remaining = MIN_LOADER_TIME - elapsed;

  const hide = () => {
    loader.classList.add("hidden");
    loaderVisible = false;
  };

  if (loaderVisible && remaining > 0) {
    setTimeout(hide, remaining);
  } else {
    hide();
  }
}

// ================================
// CHARGEMENT DU JSON
// ================================
showLoaderDelayed();

fetch("data/yokai.json")
  .then(res => {
    if (!res.ok) throw new Error("Erreur réseau");
    return res.json();
  })
  .then(data => {
    allYokai = data;
    displayYokai();
  })
  .catch(err => {
    console.error(err);
    hideLoader();
    document.body.insertAdjacentHTML(
      "beforeend",
      "<p style='color:red'>Erreur chargement JSON</p>"
    );
  });

// ================================
// AFFICHAGE DES YO-KAI
// ================================
function displayYokai() {

  const container = document.getElementById("yokai-list");
  if (!container) return;

  showLoaderDelayed();
  container.innerHTML = "";

  const filtered = allYokai.filter(yokai => {

    const matchSearch =
      normalize(yokai.name).includes(normalize(searchTerm));

    const matchTribe =
      currentTribe === "all" ||
      normalize(yokai.tribe) === normalize(currentTribe);

    const matchRarity =
      currentRarity === "all" ||
      normalize(yokai.rarity) === normalize(currentRarity);

    const matchRank =
      currentRank === "all" ||
      normalize(yokai.rank) === normalize(currentRank);

    return matchSearch && matchTribe && matchRarity && matchRank;
  });

  filtered.sort((a, b) => a.id - b.id);

  // ================================
  // COMPTEUR
  // ================================
  const counter = document.getElementById("yokai-counter");
  if (counter) {
    const text = filtered.length > 1 ? "Yo-kai trouvés" : "Yo-kai trouvé";
    counter.textContent = `🔎 ${filtered.length} ${text}`;
  }

  if (filtered.length === 0) {
    container.innerHTML =
      "<p class='text-center'>Aucun Yo-kai trouvé</p>";
    hideLoader();
    return;
  }

  // ================================
  // GENERATION DES CARTES
  // ================================
  filtered.forEach(yokai => {

    const imageName =
      yokai.image ??
      normalize(yokai.name).replace(/\s+/g, "") + ".webp";

    container.innerHTML += `
      <div class="col-md-3 col-sm-6 mb-4">
        <div class="card h-100 tribe-${normalize(yokai.tribe)}">
          <div class="card-body">

            <div class="rank-container text-center mb-2">
              <img src="images/ranks/${yokai.rank}.png"
                   alt="Rang ${yokai.rank}"
                   class="rank-img" />
            </div>

            <div class="rarity-container text-center mb-2">
              <img src="images/rarity/${yokai.rarity}.png"
                   alt="Rareté ${yokai.rarity}"
                   class="rarity-img"
                   onerror="this.style.display='none'" />
            </div>

            <img src="images/yokai/${imageName}"
                 alt="${yokai.name}"
                 class="yokai-img"
                 onerror="this.src='images/yokai/unknown.webp'" />

            <img src="images/tribes/${normalize(yokai.tribe)}.png"
                 alt="${yokai.tribe}"
                 class="tribe-icon" />

            <h5 class="card-title text-center">${yokai.name}</h5>
            <p class="text-center text-muted">${yokai.tribe}</p>

            ${createStat("❤️ PV", yokai.hp, "hp")}
            ${createStat("⚔️ ATK", yokai.attack, "atk")}
            ${createStat("🛡️ DEF", yokai.defense, "def")}
            ${createStat("⚡ VIT", yokai.speed, "spd")}
            ${createStat("🔮 ESP", yokai.spirit, "spt")}

          </div>
        </div>
      </div>
    `;
  });

  // ================================
  // ATTENTE DU CHARGEMENT DES IMAGES
  // ================================
  const images = container.querySelectorAll("img");
  let loaded = 0;
  const total = images.length;

  if (total === 0) {
    hideLoader();
    return;
  }

  images.forEach(img => {
    if (img.complete) {
      imageLoaded();
    } else {
      img.addEventListener("load", imageLoaded);
      img.addEventListener("error", imageLoaded);
    }
  });

  function imageLoaded() {
    loaded++;
    if (loaded === total) {
      hideLoader();
    }
  }
}

// ================================
// FONCTION BARRES DE STATS
// ================================
function createStat(label, value, className) {
  return `
    <div class="stat">
      <div class="stat-label">${label} <span>${value}</span></div>
      <div class="stat-bar">
        <div class="stat-fill ${className}" style="width:${value}%"></div>
      </div>
    </div>
  `;
}

// ================================
// FILTRES GENERIQUES
// ================================
function setupFilter(selector, variableSetter) {
  document.querySelectorAll(selector).forEach(btn => {
    btn.addEventListener("click", () => {

      variableSetter(btn.dataset);

      document
        .querySelectorAll(selector)
        .forEach(b => b.classList.remove("active"));

      btn.classList.add("active");

      displayYokai();
    });
  });
}

setupFilter(".filter-btn", data => currentTribe = data.tribe);
setupFilter(".rarity-btn", data => currentRarity = data.rarity);
setupFilter(".rank-btn", data => currentRank = data.rank);

// ================================
// RECHERCHE
// ================================
const searchInput = document.getElementById("search-input");
if (searchInput) {
  searchInput.addEventListener("input", e => {
    searchTerm = e.target.value;
    displayYokai();
  });
}