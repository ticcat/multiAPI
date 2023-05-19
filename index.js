import API from "./scripts/api.js";
import Endpoint from "./scripts/endpoint.js";

/* #region  APIs definitions */

const pokeAPIFirstLevelEndpoints = [
    new Endpoint("Berries", null, "/berry"),
    new Endpoint("Items", null, "/item"),
    new Endpoint("Locations", null, "/location"),
    new Endpoint("Moves", null, "/move"),
    new Endpoint("Pokemons", null, "/pokemon"),
];
const pokeAPI = new API(
    "Pokémon API",
    "url('icons/APIs/pokemon.svg')",
    "https://pokeapi.co/api/v2/",
    pokeAPIFirstLevelEndpoints
);

const swAPIFirstLevelEndpoints = [
    new Endpoint("Films", null, "/films"),
    new Endpoint("People", null, "/people"),
    new Endpoint("Planets", null, "/planets"),
    new Endpoint("Species", null, "/species"),
    new Endpoint("Starships", null, "/starships"),
    new Endpoint("Vehicles", null, "/vehicles"),
];
const swAPI = new API(
    "Star Wars API",
    "url('icons/APIs/star-wars.svg')",
    "https://swapi.dev/api/",
    swAPIFirstLevelEndpoints
);

const hpAPIFirstLevelEndpoints = [
    new Endpoint("Characters", null, "/characters"),
    new Endpoint("Characters", null, "/spells"),
];
const hpAPI = new API(
    "Harry Potter API",
    "url('icons/APIs/harry-potter.svg')",
    "https://hp-api.onrender.com/api/",
    hpAPIFirstLevelEndpoints
);
/* #endregion */

window.onload = () => {
    // DOM related code here to ensure everytihng is loaded beforehand.
    setCurrentAPITitle(pokeAPI.name);
    setCurrentAccessibleEndpoints(pokeAPI.firstLevelEndPoints);
};

function setCurrentAPITitle(apiName) {
    let currentAPITitle = document.getElementById("currentAPI");

    currentAPITitle.innerHTML = apiName;
}

function setCurrentAccessibleEndpoints(endpoints) {
    let accesibleEndpoints = document.getElementById(
        "currentAccessibleEndpoints"
    );

    endpoints.forEach((eP) => {
        let newEndpoint = document.createElement("li");
        let newEndpointLink = document.createElement("a");

        newEndpointLink.innerHTML = eP.name;
        newEndpointLink.href = "url";

        newEndpoint.appendChild(newEndpointLink);
        accesibleEndpoints.appendChild(newEndpoint);
    });
}
