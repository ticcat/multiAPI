export default function swAPIDataFilter(rawData, endpointType) {
    switch (endpointType) {
        case "Films":
            return filterFilmData(rawData);
        case "People":
            return filterPeopleData(rawData);
        case "Planets":
            return filterPlanetsData(rawData);
        case "Species":
            return filterSpeciesData(rawData);
        case "Starships":
            return filterStarshipsData(rawData);
        case "Vehicles":
            return filterVehiclesData(rawData);
    }
}

function filterFilmData(rawData) {
    const filmDataModel = {
        episode_id: { key: "Episode Id", value: 0 },
        opening_crawl: { key: "Opening crawl", value: "" },
        director: { key: "Director", value: "" },
        producer: { key: "Producer", value: "" },
        release_date: { key: "Release date", value: "" },
        // TODO: Add people, planets, starships and vehicles from fetching
    };

    return filterDataFromModel(rawData, filmDataModel);
}

function filterPeopleData(rawData) {
    const peopleDataModel = {
        name: { key: "Name", value: "" },
        birth_year: { key: "Birth year", value: "" },
        gender: { key: "Gender", value: "" },
        height: { key: "Height", value: "" },
        mass: { key: "Mass", value: "" },
        hair_color: { key: "Hair color", value: "" },
        eye_color: { key: "Eye color", value: "" },
        skin_color: { key: "Skin color", value: "" },
        //TODO: Add films
    };

    return filterDataFromModel(rawData, peopleDataModel);
}

function filterPlanetsData(rawData) {
    const planetDataModel = {
        name: { key: "Name", value: "" },
        rotation_period: { key: "Rotation period", value: "" },
        orbital_period: { key: "Orbital period", value: "" },
        diameter: { key: "Diameter", value: "" },
        climate: { key: "Climate", value: "" },
        gravity: { key: "Gravity", value: "" },
        terrain: { key: "Terrain", value: "" },
        surface_water: { key: "Surface water", value: "" },
        population: { key: "Population", value: "" },
        // TODO: Add films
    };

    return filterDataFromModel(rawData, planetDataModel);
}

function filterSpeciesData(rawData) {
    const speciesDataModel = {
        name: { key: "Name", value: "" },
        classification: { key: "Classification", value: "" },
        designation: { key: "Designaiton", value: "" },
        average_height: { key: "Average height", value: "" },
        skin_colors: { key: "Skin colors", value: "" },
        hair_colors: { key: "Hair colors", value: "" },
        eye_colors: { key: "Eye color", value: "" },
        average_lifespan: { key: "Average lifespan", value: "" },
        language: { key: "Language", value: "" },
        // TODO: Add films
    };

    return filterDataFromModel(rawData, speciesDataModel);
}

function filterStarshipsData(rawData) {
    const starshipsDataModel = {
        name: { key: "Name", value: "" },
        model: { key: "Model", value: "" },
        starship_class: { key: "Starship class", value: "" },
        manufacturer: { key: "Manufacturer", value: "" },
        length: { key: "Length", value: "" },
        crew: { key: "Crew", value: "" },
        // TODO: Add films
    };

    return filterDataFromModel(rawData, starshipsDataModel);
}

function filterVehiclesData(rawData) {
    const vehiclesDataModel = {
        name: { key: "Name", value: "" },
        model: { key: "Model", value: "" },
        vehicle_class: { key: "Vehicle class", value: "" },
        manufacturer: { key: "Manufacturer", value: "" },
        length: { key: "Length", value: "" },
        crew: { key: "Crew", value: "" },
        // TODO: Add films
    };

    return filterDataFromModel(rawData, vehiclesDataModel);
}

function filterDataFromModel(rawData, dataModel) {
    let filteredData = dataModel;

    for (let key in dataModel) {
        filteredData[key].value = rawData[key];
    }

    return filteredData;
}
