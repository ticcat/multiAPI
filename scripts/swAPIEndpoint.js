import Endpoint from "./../scripts/Endpoint.js";

export default class SWAPIEndpoint extends Endpoint {
    constructor(name, spriteUrl, parentEP, endpointUrl, api) {
        super(name, spriteUrl, parentEP, endpointUrl, api);
    }

    getChildEndpointsFromData(data) {
        let childEndpoints = [];

        let newEndpointsPromise = data.results.map((element) =>
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
        let newEPName =
            rawData.name !== undefined ? rawData.name : rawData.title;
        let newEPSpriteUrl = this.spriteUrl;
        let newEndpoint = new SWAPIEndpoint(
            newEPName,
            newEPSpriteUrl,
            this,
            rawData.url,
            this.api
        );

        return newEndpoint;
    }

    getPaginationUrl(_) {
        return this.url + `?page=${this.pagInfo.page}`;
    }

    getSearchUrls(searchTerm) {
        let result = [];

        if (this.isBaseEndpoint()) {
            this.api.firstLevelEndPoints.forEach((endpoint) => {
                result.push(endpoint.getSearchUrls(searchTerm));
            });
        } else {
            result.push(this.url + "/?search=" + searchTerm);
        }

        return result;
    }
}
