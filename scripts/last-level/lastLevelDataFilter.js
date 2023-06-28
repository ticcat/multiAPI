import PokeAPIEndpoint from "./../pokeAPIEndpoint.js";
import SWAPIEndpoint from "../swAPIEndpoint.js";
import HPAPIEndpoint from "../hpAPIEndpoint.js";
import pokeAPIDataFilter from "./pokeAPIFilters.js";

export default function filterRawData(rawData, endpoint) {
    let endpointPrototype = Object.getPrototypeOf(endpoint);

    switch (endpointPrototype) {
        case PokeAPIEndpoint.prototype: {
            return pokeAPIDataFilter(rawData, endpoint.parent.name);
        }
        case SWAPIEndpoint.prototype: {
            console.log("star wars");
            break;
        }
        case HPAPIEndpoint.prototype: {
            console.log("harry potter");
            break;
        }
        default:
            return [];
    }
}
