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

    isLastLevel() {
        return this.parent.name !== "Base";
    }

    async getData() {
        this.#abortController = new AbortController();
        this.#abortSignal = this.#abortController.signal;

        let result = fetch(this.url, { signal: this.#abortSignal })
            .then((response) => response.json())
            .then((data) => {
                let dataResult = this.isLastLevel()
                    ? data
                    : this.getChildEndpointsFromData(data);

                return {
                    isLastLevel: this.isLastLevel(),
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

    async getSprite() {
        return this.spriteUrl;
    }

    abortFetch() {
        if (this.#abortController !== null) this.#abortController.abort();
    }
}
