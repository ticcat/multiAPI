export default function pokeAPIDataFilter(rawData, endpointType) {
    switch (endpointType) {
        case "Berries":
            return filterBerryData(rawData);
        case "Items":
            return filterItemData(rawData);
        case "Locations":
            return filterLocationData(rawData);
        case "Moves":
            return filterMoveData(rawData);
        case "Pokemons":
            return filterPokemonData(rawData);
        default:
            break;
    }
}

function filterBerryData(rawData) {
    const berryDataModel = {
        id: { key: "Id", value: 0 },
        size: { key: "Size", value: 0 },
        natural_gift_type: { key: "Natural gift type", value: "" },
        natural_gift_power: { key: "Natural gift power", value: 0 },
        growth_time: { key: "Growth time", value: 0 },
        max_harvest: { key: "Max harvest", value: 0 },
        firmness: { key: "Firmness", value: 0 },
        flavors: { key: "Flavors", value: [] },
    };

    let filteredData = berryDataModel;

    // Format each data as we please, reusing code as much as possible
    for (let key in filteredData) {
        switch (key) {
            case "flavors": {
                filteredData[key].value = rawData[key]
                    .filter((it) => it.potency > 0)
                    .map((it) => " " + it.flavor.name);
                break;
            }
            case "natural_gift_type":
            case "firmness": {
                filteredData[key].value = rawData[key].name;
                break;
            }
            default: {
                filteredData[key].value = rawData[key];
            }
        }
    }

    return filteredData;
}

function filterItemData(rawData) {
    const itemDataModel = {
        id: { key: "Id", value: 0 },
        cost: { key: "Cost", value: 0 },
        effect_entries: { key: "Effect", value: "" },
        flavor_text_entries: { key: "Flavor", value: "" },
        attributes: { key: "Attributes", value: [] },
    };

    let filteredData = itemDataModel;

    for (let key in filteredData) {
        switch (key) {
            case "effect_entries": {
                filteredData[key].value = rawData[key].find(
                    (it) => it.language.name === "en"
                ).effect;
                break;
            }
            case "flavor_text_entries": {
                filteredData[key].value = rawData[key].find(
                    (it) => it.language.name === "en"
                ).text;
                break;
            }
            case "attributes": {
                filteredData[key].value = rawData[key].map(
                    (it) => " " + it.name
                );
                break;
            }
            default: {
                filteredData[key].value = rawData[key];
            }
        }
    }

    return filteredData;
}

function filterLocationData(rawData) {
    const locationDataModel = {
        id: { key: "Id", value: 0 },
        region: { key: "Region", value: "" },
        areas: { key: "Areas", value: [] },
    };

    let filteredData = locationDataModel;

    for (let key in filteredData) {
        switch (key) {
            case "region": {
                filteredData[key].value = rawData[key].name;
                break;
            }
            case "areas": {
                filteredData[key].value = rawData[key].map(
                    (it) => " " + it.name
                );
                break;
            }
            default: {
                filteredData[key].value = rawData[key];
            }
        }
    }

    return filteredData;
}

function filterMoveData(rawData) {
    const moveDataModel = {
        id: { key: "Id", value: 0 },
        type: { key: "Type", value: "" },
        effect_entries: { key: "Effect", value: "" },
        accuracy: { key: "Accuracy", value: 0 },
        power: { key: "Power", value: 0 },
        pp: { key: "PP", value: 0 },
        priority: { key: "Priority", value: 0 },
        learned_by_pokemon: { key: "Learned by", value: [] },
    };

    let filteredData = moveDataModel;

    for (let key in filteredData) {
        switch (key) {
            case "type": {
                filteredData[key].value = rawData[key].name;
                break;
            }
            case "effect_entries": {
                filteredData[key].value = rawData[key].find(
                    (it) => it.language.name === "en"
                ).effect;
                break;
            }
            case "learned_by_pokemon": {
                filteredData[key].value = rawData[key].map(
                    (it) => " " + it.name
                );
                break;
            }
            default: {
                filteredData[key].value = rawData[key];
            }
        }
    }

    return filteredData;
}

function filterPokemonData(rawData) {
    const pokemonDataModel = {
        id: { key: "Id", value: 0 },
        height: { key: "Height", value: 0 },
        weight: { key: "Weight", value: 0 },
        base_experience: { key: "Base exp", value: 0 },
        types: { key: "Types", value: [] },
        stats: { key: "Stats", value: [] },
        abilities: { key: "Abilities", value: [] },
        moves: { key: "Moves", value: [] },
    };

    let filteredData = pokemonDataModel;

    for (let key in filteredData) {
        switch (key) {
            case "types": {
                filteredData[key].value = rawData[key].map(
                    (it) => " " + it.type.name
                );
                break;
            }
            case "stats": {
                filteredData[key].value = rawData[key].map(
                    (it) => " <b>" + it.stat.name + "</b>: " + it.base_stat
                );
                break;
            }
            case "abilities": {
                filteredData[key].value = rawData[key].map(
                    (it) => " " + it.ability.name
                );
                break;
            }
            case "moves": {
                filteredData[key].value = rawData[key].map(
                    (it) => " " + it.move.name
                );
                break;
            }
            default: {
                filteredData[key].value = rawData[key];
            }
        }
    }

    return filteredData;
}
