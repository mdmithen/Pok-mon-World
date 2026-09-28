const API = "https://pokeapi.co/api/v2/pokemon/";

const container =
document.getElementById("pokemon-container");

const message =
document.getElementById("message");

const loadMore =
document.getElementById("load-more");

const form =
document.getElementById("form");

const input =
document.getElementById("input");

let offset = 0;

const limit = 20;

// =========================
// LOAD POKÉMON
// =========================

async function loadPokemon() {

message.textContent =
"Loading Pokémon...";

loadMore.disabled = true;

try {

const response = await fetch(
  `${API}?limit=${limit}&offset=${offset}`
);


if (!response.ok) {
  throw new Error("Failed to load");
}


const data = await response.json();


const pokemonData =
  await Promise.all(

    data.results.map(
      async pokemon => {

        const response =
          await fetch(pokemon.url);

        return response.json();

      }
    )

  );


pokemonData.forEach(
  pokemon => createCard(pokemon)
);


offset += limit;


message.textContent = "";

loadMore.disabled = false;


}

catch (error) {

message.textContent =
  "❌ Could not load Pokémon. Please try again.";

loadMore.disabled = false;


}

}

// =========================
// CREATE CARD
// =========================

function createCard(pokemon) {

const card =
document.createElement("article");

card.className = "card";

const types =
pokemon.types
.map(type => {

    const name =
      type.type.name;

    return `
      <span class="type ${name}">
        ${name}
      </span>
    `;

  })
  .join("");


const image =
pokemon.sprites.other?.[
"official-artwork"
]?.front_default
||
pokemon.sprites.front_default;

card.innerHTML = `

<div class="card-top">

  <span class="card-id">
    #${String(pokemon.id).padStart(4, "0")}
  </span>

  <div class="pokeball"></div>

</div>


<img
  src="${image}"
  alt="${pokemon.name}"
  loading="lazy"
>


<h2>
  ${pokemon.name}
</h2>


<div class="types">
  ${types}
</div>


<div class="card-info">

  <div class="info-box">

    <small>Height</small>

    <b>
      ${pokemon.height / 10} m
    </b>

  </div>


  <div class="info-box">

    <small>Weight</small>

    <b>
      ${pokemon.weight / 10} kg
    </b>

  </div>

</div>


`;

container.appendChild(card);

}

// =========================
// LOAD MORE
// =========================

loadMore.addEventListener(
"click",
() => {

loadPokemon();


}
);

// =========================
// SEARCH
// =========================

form.addEventListener(
"submit",
async event => {

event.preventDefault();


const name =
  input.value
    .trim()
    .toLowerCase();


if (!name) return;


message.textContent =
  "Searching...";


try {

  const response =
    await fetch(API + name);


  if (!response.ok) {
    throw new Error("Not found");
  }


  const pokemon =
    await response.json();


  container.innerHTML = "";


  createCard(pokemon);


  message.textContent = "";


  loadMore.style.display =
    "none";

}

catch {

  container.innerHTML = "";

  message.textContent =
    "❌ Pokémon not found. Try another name.";

}


}
);

// =========================
// QUICK SEARCH
// =========================

document
.querySelectorAll(".quick button")
.forEach(button => {

button.addEventListener(
  "click",
  () => {

    const name =
      button.dataset.name;


    input.value = name;


    form.dispatchEvent(
      new Event("submit")
    );

  }
);


});

// =========================
// START WEBSITE
// =========================


loadPokemon();
