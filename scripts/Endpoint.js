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

    async getData() {
        let composedUrl = this.url;

        let result = fetch(composedUrl)
            .then((response) => response.json())
            .then((data) => {
                let result = [];

                for (const element of data.results) {
                    let newEndpoint = new Endpoint(
                        element.name,
                        this,
                        element.url
                    );

                    result.push(newEndpoint);
                }

                return result;
            });

        return result;
    }
}
