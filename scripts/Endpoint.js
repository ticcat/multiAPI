export default class Endpoint {
    name = "";
    spriteUrl = "";
    parent = null;
    url = "";
    childEndpoints = [];

    #abortController = null;
    #abortSignal = null;

    constructor(name, spriteUrl, parentEP, endpointUrl) {
        this.name = name;
        this.spriteUrl = spriteUrl;
        this.parent = parentEP;
        this.url = endpointUrl;
    }

    #isLastLevel() {
        return this.parent.name !== "Base";
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
            .then((data) => {
                let dataResult = this.#isLastLevel()
                    ? data
                    : this.#getChildEndpointsFromData(data);

                return {
                    isLastLevel: this.#isLastLevel(),
                    data: dataResult,
                };
            })
            .catch((_) => {
                return {
                    isLastLevel: false,
                    data: [],
                };
            });

        return result;
    }

    abortFetch() {
        if (this.#abortController !== null) this.#abortController.abort();
    }
}
