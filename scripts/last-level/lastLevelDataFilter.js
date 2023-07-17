import PokeAPIEndpoint from "./../pokeAPIEndpoint.js";
import SWAPIEndpoint from "../swAPIEndpoint.js";
import HPAPIEndpoint from "../hpAPIEndpoint.js";
import pokeAPIDataFilter from "./pokeAPIFilters.js";
import swAPIDataFilter from "./swAPIFilters.js";

export function filterRawData(rawData, endpoint) {
    let endpointPrototype = Object.getPrototypeOf(endpoint);

    switch (endpointPrototype) {
        case PokeAPIEndpoint.prototype: {
            return pokeAPIDataFilter(rawData, endpoint.parent.name);
        }
        case SWAPIEndpoint.prototype: {
            return swAPIDataFilter(rawData, endpoint.parent.name);
        }
        case HPAPIEndpoint.prototype: {
            console.log("harry potter");
            break;
        }
        default:
            return [];
    }
}

export default function filterDataFromSearch(rawData, endpointType, api) {
    switch (api.name) {
        case "Pokémon API":
            return pokeAPIDataFilter(rawData, endpointType);
        case "Star Wars API":
            return swAPIDataFilter(rawData, endpointType);
    }
}
