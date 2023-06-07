import Endpoint from "./../scripts/Endpoint.js";

export default class HPAPIEndpoint extends Endpoint {
    constructor(name, spriteUrl, parentEP, endpointUrl) {
        super(name, spriteUrl, parentEP, endpointUrl);
    }

    async getChildEndpointsFromData(data) {
        let childEndpoints = [];

        for (const element of data) {
            let newEPName = element.name;
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
