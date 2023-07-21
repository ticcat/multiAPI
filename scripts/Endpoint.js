export default class Endpoint {
    name = "";
    spriteUrl = "";
    parent = null;
    url = "";
    api = null;

    numberOfChildren = 0;
    childEndpoints = [];
    entriesPerPage = 10;
    pagInfo = {
        page: 1,
        nextUrl: "",
        previousUrl: "",
        entriesPerPage: this.entriesPerPage,
        entriesOnPage: 0,
    };

    #abortController = null;
    #abortSignal = null;

    constructor(name, spriteUrl, parentEP, endpointUrl, api) {
        this.name = name;
        this.spriteUrl = spriteUrl;
        this.parent = parentEP;
        this.url = endpointUrl;
        this.api = api;
    }

    isBaseEndpoint() {
        return this.name === "Base";
    }

    isLastLevel() {
        return this.parent !== null && this.parent.name !== "Base";
    }

    abortFetch() {
        if (this.#abortController != null) this.#abortController.abort();
    }

    resetPaginationInfo() {
        this.#setPaginationInfo();
    }

    getNextUrl(data) {
        return data.next;
    }

    getPrevUrl(data) {
        return data.previous;
    }

    async getNextData() {
        return this.getData(this.pagInfo.nextUrl, false, 1);
    }

    async getPrevData() {
        return this.getData(this.pagInfo.previousUrl, false, -1);
    }

    async getData(
        fetchUrl = this.getPaginationUrl(),
        intialFetch = this.pagInfo.page === 1,
        pageChange = 0
    ) {
        this.#abortController = new AbortController();
        this.#abortSignal = this.#abortController.signal;

        let result = fetch(fetchUrl, {
            signal: this.#abortSignal,
        })
            .then((response) => response.json())
            .then((data) => {
                let dataResult = this.isLastLevel()
                    ? data
                    : this.getChildEndpointsFromData(data);

                if (!this.isLastLevel()) {
                    this.numberOfChildren = data.results.length;

                    this.#setPaginationInfo(
                        intialFetch ? 1 : this.pagInfo.page + pageChange,
                        this.getNextUrl(data),
                        this.getPrevUrl(data),
                        this.numberOfChildren
                    );
                }

                return {
                    isLastLevel: this.isLastLevel(),
                    data: dataResult,
                    pagInfo: this.pagInfo,
                };
            })
            .catch((_) => {
                return {
                    aborted: true,
                };
            });

        return result;
    }

    async getSprite() {
        return this.spriteUrl;
    }

    #setPaginationInfo(
        page = 1,
        nextUrl = null,
        previousUrl = null,
        entriesOnPage = 0
    ) {
        this.pagInfo.page = page;
        this.pagInfo.nextUrl = nextUrl;
        this.pagInfo.previousUrl = previousUrl;
        this.pagInfo.entriesOnPage = entriesOnPage;
    }
}
