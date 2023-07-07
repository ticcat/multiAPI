export default class Endpoint {
    name = "";
    spriteUrl = "";
    parent = null;
    url = "";

    numberOfChildren = 0;
    childEndpoints = [];
    defaultEntriesNumber = 10;
    pagInfo = {
        page: 1,
        nextUrl: "",
        previousUrl: "",
        entriesPerPage: this.defaultEntriesNumber,
        entriesOnPage: 0,
    };

    #abortController = null;
    #abortSignal = null;

    constructor(name, spriteUrl, parentEP, endpointUrl) {
        this.name = name;
        this.spriteUrl = spriteUrl;
        this.parent = parentEP;
        this.url = endpointUrl;
    }

    isLastLevel() {
        return this.parent !== null && this.parent.name !== "Base";
    }

    async getNextData() {
        return this.getData(this.pagInfo.nextUrl, false, 1);
    }

    async getPrevData() {
        return this.getData(this.pagInfo.previousUrl, false, -1);
    }

    async getData(
        fetchUrl = this.getPaginationUrl(this.defaultEntriesNumber),
        intialFetch = true,
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
                        data.next,
                        data.previous
                    );
                }

                return {
                    isLastLevel: this.isLastLevel(),
                    data: dataResult,
                    pagInfo: this.pagInfo,
                };
            })
            .catch((error) => {
                console.log(`Error: ${error}`);
                return {
                    isLastLevel: false,
                    data: [],
                    pagInfo: {},
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

    #setPaginationInfo(page = 1, nextUrl = null, previousUrl = null) {
        this.pagInfo.page = page;
        this.pagInfo.nextUrl = nextUrl;
        this.pagInfo.previousUrl = previousUrl;
        this.pagInfo.entriesOnPage = this.numberOfChildren;
    }
}
