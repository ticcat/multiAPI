export default class Endpoint {
    name = "";
    parentEndpoint = null;
    url = "";
    childEndpoints = [];

    #abortController = null;
    #abortSignal = null;

    constructor(name, fatherEndpoint, endpointUrl) {
        this.name = name;
        this.parentEndpoint = fatherEndpoint;
        this.url = endpointUrl;
    }

    async getData() {
        this.#abortController = new AbortController();
        this.#abortSignal = this.#abortController.signal;

        let composedUrl = this.url;

        let result = fetch(composedUrl, { signal: this.#abortSignal })
            .then((response) => response.json())
            .then((data) => {
                let result = [];

                try {
                    for (const element of data.results) {
                        let newEndpoint = new Endpoint(
                            element.name,
                            this,
                            element.url
                        );

                        result.push(newEndpoint);
                    }
                } catch (error) {
                    if (error.message === "data.results is not iterable") {
                        for (const element of data) {
                            let newEndpoint = new Endpoint(
                                element.name,
                                this,
                                element.url
                            );

                            result.push(newEndpoint);
                        }
                    }
                } finally {
                    return result;
                }
            })
            .catch((error) => {
                if (error.message === "AbortError") {
                    console.log("aborted");
                }
                return [];
            });

        return result;
    }

    abortFetch() {
        if (this.#abortController !== null) this.#abortController.abort();
    }
}
