import Endpoint from "./../scripts/Endpoint.js";

export default class HPAPIEndpoint extends Endpoint {
    alternate_names = [];
    species = "";
    gender = "";
    house = "";
    dateOfBirth = "";
    ancestry = "";
    wand = {
        wood: "",
        core: "",
        length: 0,
    };
    patronus = "";

    constructor(
        name,
        spriteUrl,
        parentEP,
        url,
        alt_names,
        species,
        gender,
        house,
        dateOfBirth,
        ancestry,
        wand,
        patronus
    ) {
        super(name, spriteUrl, parentEP, url);

        this.alternate_names = alt_names;
        this.species = species;
        this.gender = gender;
        this.house = house;
        this.dateOfBirth = dateOfBirth;
        this.ancestry = ancestry;
        this.wand = wand;
        this.patronus = patronus;
    }

    getChildEndpointsFromData(data) {
        let childEndpoints = [];

        let newEndpointsPromise = data.map((element) =>
            this.#createNewEndpointFromRawData(element)
        );

        return Promise.allSettled(newEndpointsPromise).then((newEndpoints) => {
            newEndpoints.forEach((newEndpoint) =>
                childEndpoints.push(newEndpoint.value)
            );

            return childEndpoints;
        });
    }

    async #createNewEndpointFromRawData(rawData) {
        let newEPName = rawData.name;
        let newEPSpriteUrl = rawData.image;
        let newEndpoint = new HPAPIEndpoint(
            newEPName,
            newEPSpriteUrl,
            this,
            "",
            rawData.alternate_names,
            rawData.species,
            rawData.gender,
            rawData.house,
            rawData.dateOfBirth,
            rawData.ancestry,
            rawData.wand,
            rawData.patronus
        );

        return newEndpoint;
    }

    async getSprite() {
        return this.spriteUrl;
    }
}
