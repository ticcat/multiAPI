export default function swAPIDataFilter(rawData, endpointType) {
    switch (endpointType) {
        case "Films":
            return filterFilmData(rawData);
        case "People":
            console.log(2);
            break;
        case "Planets":
            console.log(3);
            break;
        case "Species":
            console.log(4);
            break;
        case "Starships":
            console.log(5);
            break;
        case "Vehicles":
            console.log(6);
            break;
    }
}

function filterFilmData(rawData) {
    const filmDataModel = {
        episode_id: { key: "Episode Id", value: 0 },
        opening_crawl: { key: "Opening crawl", value: "" },
        director: { key: "Director", value: "" },
        producer: { key: "Producer", value: "" },
        release_date: { key: "Release date", value: "" },
    };

    let filteredData = filmDataModel;

    for (let key in filmDataModel) {
        switch (key) {
            default: {
                filteredData[key].value = rawData[key];
            }
        }
    }

    return filteredData;
}
