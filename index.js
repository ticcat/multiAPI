import API from "./scripts/API.js";
import PokeAPIEndpoint from "./scripts/pokeAPIEndpoint.js";
import SWAPIEndpoint from "./scripts/swAPIEndpoint.js";
import HPAPIEndpoint from "./scripts/hpAPIEndpoint.js";
import { setVarState, getVarState } from "./scripts/stateManager.js";
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

setVarState("accessibleAPIs", accessibleAPIs);
/* #endregion */

window.onload = () => {
    setUpTopbar();
    setUpPaginationFooter();
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

    let currentAPI = setVarState("currentAPI", api);
    let currentEP = setVarState("currentEndpoint", currentAPI.baseEndpoint);

    setCurrentAPIButton(currentAPI.name);
    setCurrentAPITitle(currentAPI.name);
    navigateFromEndpoint(currentEP);
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

function setUpTopbar() {
    let mainPanelTopbar = document.getElementById("mainpanel-topbar");

    mainPanelTopbar.onBackButtonClick = function () {
        navigateBack();
    };

    mainPanelTopbar.setAttribute("state", topBarState.Full);
}

function setUpPaginationFooter() {
    let paginationFooter = document.getElementById("pagination-footer");

    paginationFooter.prevBtnOnclick = function () {
        navigateToPreviousPage();
    };
    paginationFooter.nextBtnOnclick = function () {
        navigateToNextPage();
    };

    paginationFooter.setAttribute("visible", false);
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
}

function showLastLevelInfo(data, endpoint) {
    let mainPanelTopbar = document.getElementById("mainpanel-topbar");
    let mainPanelData = document.getElementById("main-panel-data");
    let mainPanelDataScroll = document.getElementById("main-panel-data-scroll");
    let screen = document.createElement("last-level-screen");
    let paginationFooter = document.getElementById("pagination-footer");

    paginationFooter.setAttribute("visible", false);
    mainPanelTopbar.setAttribute("state", topBarState.OnlyBackBtn);

    screen.id = "last-level-screen";
    screen.endpoint = endpoint;
    screen.data = data;
    mainPanelDataScroll.style = "height: 0";
    mainPanelData.appendChild(screen);
}

function navigateBack() {
    let currentEP = getVarState("currentEndpoint");

    if (!currentEP.isLastLevel()) {
        currentEP.resetPaginationInfo();
    }
    navigateFromEndpoint(currentEP.parent);
}

function navigateFromEndpoint(endpoint) {
    abortCurrentEndpointCall();
    clearMainPanelEndpoints();

    let mainPanelTopBar = document.getElementById("mainpanel-topbar");
    let paginationFooter = document.getElementById("pagination-footer");

    let currentEP = setVarState("currentEndpoint", endpoint);

    if (currentEP.name === "Base") {
        mainPanelTopBar.setAttribute("state", topBarState.Full);
        paginationFooter.setAttribute("visible", false);
        setCurrentAccessibleEndpoints(
            getVarState("currentAPI").firstLevelEndPoints
        );
    } else {
        currentEP.getData().then((result) => endpointDataFetchHandler(result));
    }
}

function navigateToNextPage() {
    abortCurrentEndpointCall();
    clearMainPanelEndpoints();

    getVarState("currentEndpoint")
        .getNextData()
        .then((result) => endpointDataFetchHandler(result));
}

function navigateToPreviousPage() {
    abortCurrentEndpointCall();
    clearMainPanelEndpoints();

    getVarState("currentEndpoint")
        .getPrevData()
        .then((result) => endpointDataFetchHandler(result));
}

function endpointDataFetchHandler(result) {
    if (result.aborted) return;

    let mainPanelTopBar = document.getElementById("mainpanel-topbar");
    let paginationFooter = document.getElementById("pagination-footer");

    const { isLastLevel, data, pagInfo } = result;
    if (isLastLevel) {
        showLastLevelInfo(data, getVarState("currentEndpoint"));
    } else {
        setVarState("paginationInfo", pagInfo);
        paginationFooter.setAttribute("visible", true);
        mainPanelTopBar.setAttribute("state", topBarState.Pagination);
        data.then((endpoints) => {
            setCurrentAccessibleEndpoints(endpoints);
        });
    }
}

function abortCurrentEndpointCall() {
    let currentEP = getVarState("currentEndpoint");

    if (currentEP != null && currentEP?.name !== "Base") currentEP.abortFetch();
}
