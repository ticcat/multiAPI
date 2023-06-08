import Endpoint from "./../scripts/Endpoint.js";

export default class PokeAPIEndpoint extends Endpoint {
    constructor(name, spriteUrl, parentEP, endpointUrl) {
        super(name, spriteUrl, parentEP, endpointUrl);
    }

    async getChildEndpointsFromData(data) {
        let childEndpoints = [];

        for (const element of data.results) {
            let newEPName = element.name;
            let newEPSpriteUrl = await this.#getCoverSprite(element);
            let newEndpoint = new Endpoint(
                newEPName,
                newEPSpriteUrl,
                this,
                element.url
            );

            childEndpoints.push(newEndpoint);
        }

        return childEndpoints;
    }

    async #getCoverSprite(element) {
        return fetch(element.url)
            .then((response) => response.json())
            .then((data) => {
                switch (this.name) {
                    case "Items":
                        return data.sprites.default;
                    case "Pokemons":
                        return data.sprites.front_default;
                    case "Berries":
                        return fetch(data.item.url)
                            .then((response) => response.json())
                            .then((item) => item.sprites.default);
                    default:
                        return this.spriteUrl;
                }
            });
    }
}
