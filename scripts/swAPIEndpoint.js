import Endpoint from "./../scripts/Endpoint.js";

export default class SWAPIEndpoint extends Endpoint {
    constructor(name, spriteUrl, parentEP, endpointUrl) {
        super(name, spriteUrl, parentEP, endpointUrl);
    }

    async getChildEndpointsFromData(data) {
        let childEndpoints = [];

        for (const element of data.results) {
            let newEPName =
                element.name !== undefined ? element.name : element.title;
            let newEPSpriteUrl = this.spriteUrl;
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
}
