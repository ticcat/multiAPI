export default class Endpoint {
    name = "";
    parentEndpoint = null;
    url = "";
    childEndpoints = [];

    constructor(name, fatherEndpoint, endpointUrl) {
        this.name = name;
        this.parentEndpoint = fatherEndpoint;
        this.url = endpointUrl;
    }

    async getData(abortSignal) {
        let composedUrl = this.url;

        let result = fetch(composedUrl, { abortSignal })
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
                    switch (error.message) {
                        case "data.results is not iterable":
                            for (const element of data) {
                                let newEndpoint = new Endpoint(
                                    element.name,
                                    this,
                                    element.url
                                );

                                result.push(newEndpoint);
                            }
                        case "AbortError":
                            console.log("Data fetch aborted");
                            return [];
                    }
                } finally {
                    return result;
                }
            });

        return result;
    }
}
