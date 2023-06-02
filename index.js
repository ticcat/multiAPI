import API from "./scripts/API.js";
import Endpoint from "./scripts/Endpoint.js";

/* #region  APIs definitions */
const accessibleAPIs = [];

const pokeAPI = new API(
    "Pokémon API",
    "/icons/APIs/pokemon.svg",
    new Endpoint("Base", null, "https://pokeapi.co/api/v2")
);

pokeAPI.firstLevelEndPoints = [
    new Endpoint(
        "Berries",
        pokeAPI.baseEndpoint,
        pokeAPI.baseEndpoint.url + "/berry"
    ),
    new Endpoint(
        "Items",
        pokeAPI.baseEndpoint,
        pokeAPI.baseEndpoint.url + "/item"
    ),
    new Endpoint(
        "Locations",
        pokeAPI.baseEndpoint,
        pokeAPI.baseEndpoint.url + "/location"
    ),
    new Endpoint(
        "Moves",
        pokeAPI.baseEndpoint,
        pokeAPI.baseEndpoint.url + "/move"
    ),
    new Endpoint(
        "Pokemons",
        pokeAPI.baseEndpoint,
        pokeAPI.baseEndpoint.url + "/pokemon"
    ),
];

accessibleAPIs.push(pokeAPI);

const swAPI = new API(
    "Star Wars API",
    "/icons/APIs/star-wars.svg",
    new Endpoint("Base", null, "https://swapi.dev/api")
);

swAPI.firstLevelEndPoints = [
    new Endpoint(
        "Films",
        swAPI.baseEndpoint,
        swAPI.baseEndpoint.url + "/films"
    ),
    new Endpoint(
        "People",
        swAPI.baseEndpoint,
        swAPI.baseEndpoint.url + "/people"
    ),
    new Endpoint(
        "Planets",
        swAPI.baseEndpoint,
        swAPI.baseEndpoint.url + "/planets"
    ),
    new Endpoint(
        "Species",
        swAPI.baseEndpoint,
        swAPI.baseEndpoint.url + "/species"
    ),
    new Endpoint(
        "Starships",
        swAPI.baseEndpoint,
        swAPI.baseEndpoint.url + "/starships"
    ),
    new Endpoint(
        "Vehicles",
        swAPI.baseEndpoint,
        swAPI.baseEndpoint.url + "/vehicles"
    ),
];
accessibleAPIs.push(swAPI);

const hpAPI = new API(
    "Harry Potter API",
    "/icons/APIs/harry-potter.svg",
    new Endpoint("Base", null, "https://hp-api.onrender.com/api")
);

hpAPI.firstLevelEndPoints = [
    new Endpoint(
        "Characters",
        hpAPI.baseEndpoint,
        hpAPI.baseEndpoint.url + "/characters"
    ),
    new Endpoint(
        "Spells",
        hpAPI.baseEndpoint,
        hpAPI.baseEndpoint.url + "/spells"
    ),
];
accessibleAPIs.push(hpAPI);
/* #endregion */

let currentAPI = null;
let currentEndpoint = null;

window.onload = () => {
    loadAccessibleAPIs();
    setCurrentAPI(accessibleAPIs[0]);
};

function loadAccessibleAPIs() {
    let apiButtonsSidePanel = document.getElementById("api-buttons-sidepanel");

    accessibleAPIs.forEach((accAPI) => {
        const newApiButton = document.createElement("api-button");

        newApiButton.buttonAPI = accAPI;
        newApiButton.setAttribute("id", accAPI.name);
        newApiButton.onclick = function () {
            setCurrentAPI(accAPI);
        };

        apiButtonsSidePanel.appendChild(newApiButton);
    });
}

function clearMainPanelEndpoints() {
    let accesibleEndpoints = document.getElementById("currAccEPCards");
    accesibleEndpoints.replaceChildren();
}

function setCurrentAPI(api) {
    abortCurrentEndpointCall();
    clearMainPanelEndpoints();

    currentAPI = api;
    currentEndpoint = currentAPI.baseEndpoint;

    setCurrentAPIButton(currentAPI.name);
    setCurrentAPITitle(currentAPI.name);
    setCurrentAccessibleEndpoints(currentAPI.firstLevelEndPoints);
}

function setCurrentAPIButton(apiName) {
    let apiButtons = document.querySelectorAll("api-button");

    apiButtons.forEach((apiBtn) => {
        if (apiBtn.id === apiName) {
            apiBtn.setAttribute("selected", true);
        } else {
            apiBtn.setAttribute("selected", false);
        }
    });
}

function setCurrentAPITitle(apiName) {
    let currentAPITitle = document.getElementById("currentAPITitle");

    currentAPITitle.innerHTML = apiName;
}

function setBackBtnVisibility() {
    let backBtn = document.getElementById("currAccEPTopBarBackBtn");

    backBtn.onclick = () => navigateBack();

    if (currentEndpoint.name !== "Base") {
        backBtn.style = "visibility: visible;";
    } else {
        backBtn.style = "visibility: hidden;";
    }
}

function setCurrentAccessibleEndpoints(endpoints) {
    let accesibleEndpoints = document.getElementById("currAccEPCards");

    endpoints.forEach((eP) => {
        let newEndpointCard = document.createElement("endpoint-card");

        newEndpointCard.cardEndpoint = eP;

        accesibleEndpoints.appendChild(newEndpointCard);
    });

    setBackBtnVisibility();
}

function showLastLevelInfo(data) {
    console.log("TODO: Implement info page.");
    console.log(data);
}

function navigateFromEndpoint(endpoint) {
    abortCurrentEndpointCall();
    clearMainPanelEndpoints();

    currentEndpoint = endpoint;

    if (currentEndpoint.name === "Base") {
        setCurrentAccessibleEndpoints(currentAPI.firstLevelEndPoints);
    } else {
        currentEndpoint.getData().then((result) => {
            const { isLastLevel, data } = result;
            if (isLastLevel) {
                showLastLevelInfo(data);
            } else {
                setCurrentAccessibleEndpoints(data);
            }
        });
    }
}

export function navigateBack() {
    navigateFromEndpoint(currentEndpoint.parent);
}

function abortCurrentEndpointCall() {
    if (currentEndpoint !== null && currentEndpoint?.name !== "Base")
        currentEndpoint.abortFetch();
}
