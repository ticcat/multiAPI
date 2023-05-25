export default class Endpoint {
    name = "";
    parent = null;
    url = "";
    childEndpoints = [];

    #abortController = null;
    #abortSignal = null;

    constructor(name, parentEP, endpointUrl) {
        this.name = name;
        this.parent = parentEP;
        this.url = endpointUrl;
    }

    #getChildEndpointsFromData(rawData) {
        let childEndpoints = [];

        let data = rawData.results !== undefined ? rawData.results : rawData;

        for (const element of data) {
            let newEPName =
                element.name !== undefined ? element.name : element.title;
            let newEndpoint = new Endpoint(newEPName, this, element.url);

            childEndpoints.push(newEndpoint);
        }

        return childEndpoints;
    }

    async getData() {
        this.#abortController = new AbortController();
        this.#abortSignal = this.#abortController.signal;

        let composedUrl = this.url;

        let result = fetch(composedUrl, { signal: this.#abortSignal })
            .then((response) => response.json())
            .then((data) => this.#getChildEndpointsFromData(data))
            .catch((error) => {
                if (error.message === "AbortError") {
                }
                return [];
            });

        return result;
    }

    abortFetch() {
        if (this.#abortController !== null) this.#abortController.abort();
    }
}
