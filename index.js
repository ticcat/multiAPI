import API from "./scripts/API.js";
import Endpoint from "./scripts/Endpoint.js";

/* #region  APIs definitions */
const accessibleAPIs = [];

const pokeAPI = new API(
    "Pokémon API",
    "/icons/APIs/pokemon.svg",
    "https://pokeapi.co/api/v2"
);

pokeAPI.firstLevelEndPoints = [
    new Endpoint("Berries", null, pokeAPI.baseUrl + "/berry"),
    new Endpoint("Items", null, pokeAPI.baseUrl + "/item"),
    new Endpoint("Locations", null, pokeAPI.baseUrl + "/location"),
    new Endpoint("Moves", null, pokeAPI.baseUrl + "/move"),
    new Endpoint("Pokemons", null, pokeAPI.baseUrl + "/pokemon"),
];

accessibleAPIs.push(pokeAPI);

const swAPI = new API(
    "Star Wars API",
    "/icons/APIs/star-wars.svg",
    "https://swapi.dev/api"
);

swAPI.firstLevelEndPoints = [
    new Endpoint("Films", null, swAPI.baseUrl + "/films"),
    new Endpoint("People", null, swAPI.baseUrl + "/people"),
    new Endpoint("Planets", null, swAPI.baseUrl + "/planets"),
    new Endpoint("Species", null, swAPI.baseUrl + "/species"),
    new Endpoint("Starships", null, swAPI.baseUrl + "/starships"),
    new Endpoint("Vehicles", null, swAPI.baseUrl + "/vehicles"),
];
accessibleAPIs.push(swAPI);

const hpAPI = new API(
    "Harry Potter API",
    "/icons/APIs/harry-potter.svg",
    "https://hp-api.onrender.com/api"
);

hpAPI.firstLevelEndPoints = [
    new Endpoint("Characters", null, hpAPI.baseUrl + "/characters"),
    new Endpoint("Spells", null, hpAPI.baseUrl + "/spells"),
];
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

function clearMainPanelEndpoints() {
    let accesibleEndpoints = document.getElementById(
        "currentAccessibleEndpoints"
    );
    accesibleEndpoints.replaceChildren();
}

function setCurrentAPI(api) {
    clearMainPanelEndpoints();

    setCurrentAPIButton(api.name);
    setCurrentAPITitle(api.name);
    setCurrentAccessibleEndpoints(api.firstLevelEndPoints);
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

        newEndpointButton.innerHTML = eP.name;
        newEndpointButton.onclick = function () {
            navigateFromEndpoint(eP);
        };

        newEndpoint.appendChild(newEndpointButton);
        accesibleEndpoints.appendChild(newEndpoint);
    });
}

function navigateFromEndpoint(endpoint) {
    clearMainPanelEndpoints();

    // Set new accessible endpoints from clicked endpoint
    endpoint.getData().then((newAccesibleEPs) => {
        setCurrentAccessibleEndpoints(newAccesibleEPs);
    });
}
