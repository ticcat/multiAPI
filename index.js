import API from "./scripts/API.js";
import PokeAPIEndpoint from "./scripts/pokeAPIEndpoint.js";
import SWAPIEndpoint from "./scripts/swAPIEndpoint.js";
import HPAPIEndpoint from "./scripts/hpAPIEndpoint.js";
import { topBarState } from "./components/topbar/topbar-behavior.js";
import {
    paginationVisibility,
    paginationState,
} from "./components/pagination-footer/pagination-footer-behavior.js";

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
    setTopbarState(topBarState.Full);
    setupPaginationFooter(false);
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
    navigateFromEndpoint(currentEndpoint);
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

function setTopbarState(newState, pagInfo) {
    let mainPanelTopbar = document.getElementById("mainpanel-topbar");

    switch (newState) {
        case topBarState.Full:
            mainPanelTopbar.onBackButtonClick = function () {};
            break;
        case topBarState.Pagination:
            setTopBarPaginationInfo(pagInfo);
            mainPanelTopbar.onBackButtonClick = function () {
                navigateBack();
            };
            break;
        case topBarState.OnlyBackBtn:
            break;
    }

    mainPanelTopbar.setAttribute("state", newState);
}

function setTopBarPaginationInfo(pagInfo) {
    let mainPanelTopbar = document.getElementById("mainpanel-topbar");

    let initValue = (pagInfo.page - 1) * pagInfo.entriesPerPage + 1;
    let finalValue = initValue - 1 + pagInfo.entriesOnPage;

    mainPanelTopbar.pagInfo = {
        ePName: currentEndpoint.name,
        init: initValue,
        final: finalValue,
    };
}

function setupPaginationFooter(visible, pagInfo) {
    let paginationFooter = document.getElementById("pagination-footer");

    if (visible) {
        paginationFooter.prevBtnOnclick = function () {
            navigateToPreviousPage();
        };
        paginationFooter.nextBtnOnclick = function () {
            navigateToNextPage();
        };
    }

    switch (true) {
        case pagInfo == null:
        case pagInfo.previousUrl == null && pagInfo.nextUrl == null:
            paginationFooter.setAttribute("state", paginationState.none);
            break;
        case pagInfo.previousUrl == null:
            paginationFooter.setAttribute("state", paginationState.onlyNext);
            break;
        case pagInfo.nextUrl == null:
            paginationFooter.setAttribute("state", paginationState.onlyPrev);
            break;
        default:
            paginationFooter.setAttribute("state", paginationState.both);
            break;
    }
    paginationFooter.style = visible ? "opacity: 1;" : "opacity: 0;";
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
    let mainPanelData = document.getElementById("main-panel-data");
    let mainPanelDataScroll = document.getElementById("main-panel-data-scroll");
    let screen = document.createElement("last-level-screen");

    setTopbarState(topBarState.OnlyBackBtn);
    setupPaginationFooter(false);

    screen.id = "last-level-screen";
    screen.endpoint = endpoint;
    screen.data = data;
    mainPanelDataScroll.style = "height: 0";
    mainPanelData.appendChild(screen);
}

function navigateBack() {
    if (!currentEndpoint.isLastLevel()) {
        currentEndpoint.resetPaginationInfo();
    }
    navigateFromEndpoint(currentEndpoint.parent);
}

function navigateFromEndpoint(endpoint) {
    abortCurrentEndpointCall();
    clearMainPanelEndpoints();

    currentEndpoint = endpoint;

    if (currentEndpoint.name === "Base") {
        setTopbarState(topBarState.Full);
        setupPaginationFooter(false);
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
    if (result.aborted) return;

    const { isLastLevel, data, pagInfo } = result;
    if (isLastLevel) {
        showLastLevelInfo(data, currentEndpoint);
    } else {
        setupPaginationFooter(true, pagInfo);
        setTopbarState(topBarState.Pagination, pagInfo);
        data.then((endpoints) => {
            setCurrentAccessibleEndpoints(endpoints);
        });
    }
}

function abortCurrentEndpointCall() {
    if (currentEndpoint !== null && currentEndpoint?.name !== "Base")
        currentEndpoint.abortFetch();
}
