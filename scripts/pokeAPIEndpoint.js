import Endpoint from "./../scripts/Endpoint.js";

export default class PokeAPIEndpoint extends Endpoint {
    constructor(name, spriteUrl, parentEP, endpointUrl) {
        super(name, spriteUrl, parentEP, endpointUrl);
    }

    getChildEndpointsFromData(data) {
        this.childEndpoints = [];

        let newEndpointsPromise = data.results.map((element) =>
            this.#createNewEndpointFromRawData(element)
        );

        return Promise.allSettled(newEndpointsPromise).then((newEndpoints) => {
            newEndpoints.forEach((newEndpoint) =>
                this.childEndpoints.push(newEndpoint.value)
            );

            return this.childEndpoints;
        });
    }

    async #createNewEndpointFromRawData(rawData) {
        let newEPSpriteUrl = "";
        let newEPName = rawData.name;
        let newEndpoint = new PokeAPIEndpoint(
            newEPName,
            newEPSpriteUrl,
            this,
            rawData.url
        );

        return newEndpoint;
    }

    async getSprite() {
        return this.spriteUrl !== "" ? this.spriteUrl : this.#getCoverSprite();
    }

    #getCoverSprite() {
        return fetch(this.url)
            .then((response) => response.json())
            .then((data) => {
                switch (this.parent.name) {
                    case "Items":
                        return data.sprites.default;
                    case "Pokemons":
                        return data.sprites.front_default;
                    case "Berries":
                        return fetch(data.item.url)
                            .then((response) => response.json())
                            .then((item) => item.sprites.default);
                    default:
                        return this.parent.spriteUrl;
                }
            });
    }
}
