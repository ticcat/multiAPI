export default function pokeAPIDataFilter(rawData, endpointType) {
    switch (endpointType) {
        case "Berries":
            return filterBerryData(rawData);
        case "Items":
            console.log(2);
            break;
        case "Locations":
            return filterLocationData(rawData);
        case "Moves":
            console.log(4);
            break;
        case "Pokemons":
            console.log(5);
            break;
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
    for (let data in filteredData) {
        switch (data) {
            case "flavors": {
                filteredData[data].value = rawData[data]
                    .filter((it) => it.potency > 0)
                    .map((it) => " " + it.flavor.name);
                break;
            }
            case "natural_gift_type":
            case "firmness": {
                filteredData[data].value = rawData[data].name;
                break;
            }
            default: {
                filteredData[data].value = rawData[data];
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

    for (let data in filteredData) {
        switch (data) {
            case "region": {
                filteredData[data].value = rawData[data].name;
                break;
            }
            case "areas": {
                filteredData[data].value = rawData[data].map(
                    (it) => " " + it.name
                );
                break;
            }
            default: {
                filteredData[data].value = rawData[data];
            }
        }
    }

    return filteredData;
}
