export default class Endpoint {
    name = "";
    spriteUrl = "";
    parent = null;
    url = "";

    childEndpoints = [];
    defaultEntriesNumber = 10;
    pagInfo = {
        page: 1,
        entriesPerPage: this.defaultEntriesNumber,
        nextUrl: "",
        previousUrl: "",
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
        this.setPaginationInfo(pagInfo.page++, this.defaultEntriesNumber);
        return this.getData((fetchUrl = this.pagInfo.nextUrl));
    }

    async getPrevData() {
        this.setPaginationInfo(pagInfo.page--, this.defaultEntriesNumber);
        return this.getData((fetchUrl = this.pagInfo.previousUrl));
    }

    async getData(
        entryNumber = this.defaultEntriesNumber,
        fetchUrl = this.getPaginationUrl(entryNumber)
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

                return {
                    isLastLevel: this.isLastLevel(),
                    data: dataResult,
                    pagInfo: this.pagInfo,
                };
            })
            .catch((_) => {
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

    setPaginationInfo(pageNumber, entriesPerPage) {
        pagInfo = {
            entriesPerPage: entriesPerPage,
            page: pageNumber,
            nextUrl: data.next,
            previousUrl: data.previous,
        };
    }
}
