export default class Endpoint {
    name = "";
    fatherEndpoint = null;
    endpointUrl = "";
    childEndpoints = [];

    constructor(name, fatherEndpoint, endpointUrl) {
        this.name = name;
        this.fatherEndpoint = fatherEndpoint;
        this.endpointUrl = endpointUrl;
    }

    getChildEndpoints() {
        // async call API to get child endpoints
    }
}
