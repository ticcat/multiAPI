import API from "./scripts/API.js";
import PokeAPIEndpoint from "./scripts/pokeAPIEndpoint.js";
import SWAPIEndpoint from "./scripts/swAPIEndpoint.js";
import HPAPIEndpoint from "./scripts/hpAPIEndpoint.js";
import { topBarState } from "./components/topbar/topbar-behavior.js";

/* #region  APIs definitions */
const accessibleAPIs = [];

const pokeAPI = new API(
    "Pokémon API",
    "/icons/APIs/pokemon.svg",
    new PokeAPIEndpoint("Base", "", null, "https://pokeapi.co/api/v2")
);

pokeAPI.firstLevelEndPoints = [
    new PokeAPIEndpoint(
        "Berries",
        "/images/PokeAPI/BerriesDefault.png",
        pokeAPI.baseEndpoint,
        pokeAPI.baseEndpoint.url + "/berry"
    ),
    new PokeAPIEndpoint(
        "Items",
        "/images/PokeAPI/ItemsDefault.png",
        pokeAPI.baseEndpoint,
        pokeAPI.baseEndpoint.url + "/item"
    ),
    new PokeAPIEndpoint(
        "Locations",
        "/images/PokeAPI/LocationsDefault.png",
        pokeAPI.baseEndpoint,
        pokeAPI.baseEndpoint.url + "/location"
    ),
    new PokeAPIEndpoint(
        "Moves",
        "/images/PokeAPI/MovesDefault.png",
        pokeAPI.baseEndpoint,
        pokeAPI.baseEndpoint.url + "/move"
    ),
    new PokeAPIEndpoint(
        "Pokemons",
        "/images/PokeAPI/PokemonsDefault.png",
        pokeAPI.baseEndpoint,
        pokeAPI.baseEndpoint.url + "/pokemon"
    ),
];

accessibleAPIs.push(pokeAPI);

const swAPI = new API(
    "Star Wars API",
    "/icons/APIs/star-wars.svg",
    new SWAPIEndpoint("Base", "", null, "https://swapi.dev/api")
);

swAPI.firstLevelEndPoints = [
    new SWAPIEndpoint(
        "Films",
        "/images/SWAPI/FilmsDefault.png",
        swAPI.baseEndpoint,
        swAPI.baseEndpoint.url + "/films"
    ),
    new SWAPIEndpoint(
        "People",
        "/images/SWAPI/PeopleDefault.png",
        swAPI.baseEndpoint,
        swAPI.baseEndpoint.url + "/people"
    ),
    new SWAPIEndpoint(
        "Planets",
        "/images/SWAPI/PlanetsDefault.png",
        swAPI.baseEndpoint,
        swAPI.baseEndpoint.url + "/planets"
    ),
    new SWAPIEndpoint(
        "Species",
        "/images/SWAPI/SpeciesDefault.png",
        swAPI.baseEndpoint,
        swAPI.baseEndpoint.url + "/species"
    ),
    new SWAPIEndpoint(
        "Starships",
        "/images/SWAPI/SpaceshipsDefault.png",
        swAPI.baseEndpoint,
        swAPI.baseEndpoint.url + "/starships"
    ),
    new SWAPIEndpoint(
        "Vehicles",
        "/images/SWAPI/VehiclesDefault.png",
        swAPI.baseEndpoint,
        swAPI.baseEndpoint.url + "/vehicles"
    ),
];
accessibleAPIs.push(swAPI);

const hpAPI = new API(
    "Harry Potter API",
    "/icons/APIs/harry-potter.svg",
    new HPAPIEndpoint("Base", "", null, "https://hp-api.onrender.com/api")
);

hpAPI.firstLevelEndPoints = [
    new HPAPIEndpoint(
        "Characters",
        "/images/HPAPI/CharactersDefault.png",
        hpAPI.baseEndpoint,
        hpAPI.baseEndpoint.url + "/characters"
    ),
    new HPAPIEndpoint(
        "Spells",
        "/images/HPAPI/SpellsDefault.png",
        hpAPI.baseEndpoint,
        hpAPI.baseEndpoint.url + "/spells"
    ),
];
// accessibleAPIs.push(hpAPI);
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

function clearLastLevelScreen() {
    let mainPanelData = document.getElementById("main-panel-data");
    let mainPanelDataScroll = document.getElementById("main-panel-data-scroll");
    let lastLevelScreen = document.getElementById("last-level-screen");

    mainPanelDataScroll.style = "height: 70vh";
    if (lastLevelScreen !== null) mainPanelData.removeChild(lastLevelScreen);
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
    let mainPanelTopbar = document.getElementById("mainpanel-topbar");

    if (currentEndpoint.name !== "Base") {
        mainPanelTopbar.onBackButtonClick = function () {
            navigateBack();
        };
        mainPanelTopbar.setAttribute("state", topBarState.Pagination);
    } else {
        mainPanelTopbar.onBackButtonClick = function () {};
        mainPanelTopbar.setAttribute("state", topBarState.Full);
    }
}

function setPaginationInfo(pagInfo) {
    let mainPanelTopbar = document.getElementById("mainpanel-topbar");

    let initValue = (pagInfo.page - 1) * pagInfo.entriesPerPage + 1;
    let finalValue = initValue - 1 + pagInfo.entriesOnPage;

    mainPanelTopbar.pagInfo = {
        ePName: currentEndpoint.name,
        init: initValue,
        final: finalValue,
    };
}

function setCurrentAccessibleEndpoints(endpoints) {
    clearLastLevelScreen();

    let accesibleEndpoints = document.getElementById("currAccEPCards");

    endpoints.forEach((eP) => {
        let newEndpointCard = document.createElement("endpoint-card");

        newEndpointCard.cardEndpoint = eP;
        newEndpointCard.onCardClick = function () {
            navigateFromEndpoint(eP);
        };

        accesibleEndpoints.appendChild(newEndpointCard);
    });

    setBackBtnVisibility();
}

function showLastLevelInfo(data, endpoint) {
    let mainPanelTopbar = document.getElementById("mainpanel-topbar");
    let mainPanelData = document.getElementById("main-panel-data");
    let mainPanelDataScroll = document.getElementById("main-panel-data-scroll");
    let screen = document.createElement("last-level-screen");

    screen.id = "last-level-screen";
    screen.endpoint = endpoint;
    screen.data = data;
    mainPanelTopbar.setAttribute("state", topBarState.OnlyBackBtn);
    mainPanelDataScroll.style = "height: 0";
    mainPanelData.appendChild(screen);
}

function navigateBack() {
    navigateFromEndpoint(currentEndpoint.parent);
}

function navigateFromEndpoint(endpoint) {
    abortCurrentEndpointCall();
    clearMainPanelEndpoints();

    currentEndpoint = endpoint;

    if (currentEndpoint.name === "Base") {
        setCurrentAccessibleEndpoints(currentAPI.firstLevelEndPoints);
    } else {
        currentEndpoint
            .getData()
            .then((result) => endpointDataFetchHandler(result));
    }
}

function navigateToNextPage() {
    abortCurrentEndpointCall();
    clearMainPanelEndpoints();

    currentEndpoint
        .getNextData()
        .then((result) => endpointDataFetchHandler(result));
}

function navigateToPreviousPage() {
    abortCurrentEndpointCall();
    clearMainPanelEndpoints();

    currentEndpoint
        .getPrevData()
        .then((result) => endpointDataFetchHandler(result));
}

function endpointDataFetchHandler(result) {
    const { isLastLevel, data, pagInfo } = result;
    if (isLastLevel) {
        showLastLevelInfo(data, currentEndpoint);
    } else {
        setPaginationInfo(pagInfo);
        data.then((endpoints) => {
            setCurrentAccessibleEndpoints(endpoints);
        });
    }
}

function abortCurrentEndpointCall() {
    if (currentEndpoint !== null && currentEndpoint?.name !== "Base")
        currentEndpoint.abortFetch();
}
