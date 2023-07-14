import Endpoint from "./../scripts/Endpoint.js";

export default class PokeAPIEndpoint extends Endpoint {
    constructor(name, spriteUrl, parentEP, endpointUrl, api) {
        super(name, spriteUrl, parentEP, endpointUrl, api);

        this.entriesPerPage = 20;
        this.pagInfo = {
            page: 1,
            entriesPerPage: this.entriesPerPage,
            nextUrl: "",
            previousUrl: "",
        };
    }

    getPrevUrl(data) {
        if (data.results.length === this.entriesPerPage) {
            return data.previous;
        } else {
            return this.getPaginationUrl(
                this.entriesPerPage,
                Math.ceil(data.count / this.entriesPerPage) - 1
            );
        }
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
            rawData.url,
            this.api
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

    getPaginationUrl(
        entriesNumber = this.entriesPerPage,
        page = this.pagInfo.page
    ) {
        let offset = page * entriesNumber - entriesNumber;
        return this.url + `?offset=${offset}&limit=${entriesNumber}`;
    }

    getSearchUrls(searchTerm) {
        let result = [];

        if (this.isBaseEndpoint()) {
            this.api.firstLevelEndPoints.forEach((endpoint) => {
                result.push(endpoint.getSearchUrls(searchTerm));
            });
        } else {
            let url = this.url + "/" + searchTerm;
            let endpointType = this.name;
            result.push({ url: url, type: endpointType });
        }

        return result;
    }
}
