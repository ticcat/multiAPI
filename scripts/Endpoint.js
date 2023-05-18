class Endpoint {
    name = "";
    fatherEndpoint = null;
    childEndpoints = [];

    constructor(name, fatherEndpoint) {
        this.name = name;
        this.fatherEndpoint = fatherEndpoint;
        this.childEndpoints = this.#getChildEndpoints();
    }

    #getChildEndpoints() {
        // async call API to get child endpoints
    }
}