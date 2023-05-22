import API from "./scripts/API.js";
import Endpoint from "./scripts/Endpoint.js";

/* #region  APIs definitions */
const accessibleAPIs = [];

const pokeAPIFirstLevelEndpoints = [
    new Endpoint("Berries", null, "/berry"),
    new Endpoint("Items", null, "/item"),
    new Endpoint("Locations", null, "/location"),
    new Endpoint("Moves", null, "/move"),
    new Endpoint("Pokemons", null, "/pokemon"),
];
const pokeAPI = new API(
    "Pokémon API",
    "/icons/APIs/pokemon.svg",
    "https://pokeapi.co/api/v2/",
    pokeAPIFirstLevelEndpoints
);
accessibleAPIs.push(pokeAPI);

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
    "/icons/APIs/star-wars.svg",
    "https://swapi.dev/api/",
    swAPIFirstLevelEndpoints
);
accessibleAPIs.push(swAPI);

const hpAPIFirstLevelEndpoints = [
    new Endpoint("Characters", null, "/characters"),
    new Endpoint("Spells", null, "/spells"),
];
const hpAPI = new API(
    "Harry Potter API",
    "/icons/APIs/harry-potter.svg",
    "https://hp-api.onrender.com/api/",
    hpAPIFirstLevelEndpoints
);
accessibleAPIs.push(hpAPI);
/* #endregion */

window.onload = () => {
    loadAccessibleAPIs();
    setCurrentAPI(accessibleAPIs[0]);
};

function loadAccessibleAPIs() {
    let apiButtonsSidePanel = document.getElementById("api-buttons-sidepanel");

    accessibleAPIs.forEach((accAPI) => {
        let newApiButton = document.createElement("div");
        let newApiButtonImg = document.createElement("img");

        newApiButton.id = accAPI.name;
        newApiButton.className = "api-button";
        newApiButton.onclick = function () {
            setCurrentAPI(accAPI);
        };

        newApiButtonImg.alt = accAPI.name + " image";
        newApiButtonImg.src = accAPI.imgSource;

        newApiButton.appendChild(newApiButtonImg);
        apiButtonsSidePanel.appendChild(newApiButton);
    });
}

function setCurrentAPI(api) {
    clearMainPanel();

    setCurrentAPIButton(api.name);
    setCurrentAPITitle(api.name);
    setCurrentAccessibleEndpoints(api.firstLevelEndPoints);
}

function clearMainPanel() {
    let accesibleEndpoints = document.getElementById(
        "currentAccessibleEndpoints"
    );
    accesibleEndpoints.replaceChildren();
}

function setCurrentAPIButton(apiName) {
    let apiButtons = document.querySelectorAll(".api-button");

    apiButtons.forEach((apiBtn) => {
        if (apiBtn.id === apiName) {
            apiBtn.className = "api-button active";
        } else {
            apiBtn.className = "api-button";
        }
    });
}

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
        let newEndpointButton = document.createElement("p");

        newEndpointLink.innerHTML = eP.name;
        newEndpointLink.href = "url";

        newEndpoint.appendChild(newEndpointLink);
        accesibleEndpoints.appendChild(newEndpoint);
    });
}
