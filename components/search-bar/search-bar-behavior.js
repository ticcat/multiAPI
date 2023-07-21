import PokeAPIEndpoint, {
    getPokeEPSprite,
} from "../../scripts/pokeAPIEndpoint.js";
import { getVarState } from "../../scripts/stateManager.js";
import SWAPIEndpoint from "../../scripts/swAPIEndpoint.js";

fetch("/components/search-bar/search-bar-template.html")
    .then((stream) => stream.text())
    .then((text) => defineSearchBar(text));

export const searchBarState = {
    centered: "center",
    leftSide: "start",
};

function defineSearchBar(html) {
    const template = document.createElement("template");
    template.innerHTML = html;

    class SearchBar extends HTMLElement {
        #searchSubmitEvent;
        #abortController;

        static get observedAttributes() {
            return ["state"];
        }

        constructor() {
            super();

            // Create shadow root and append fetched html
            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(template.content.cloneNode(true));

            this.#setUpSearchBar();
        }

        connectedCallback() {
            document.addEventListener("searchNotFound", (_) => {
                this.#searchNotFoundHandler();
            });

            document.addEventListener("searchCancel", (_) => {
                this.#searchCancelHandler();
            });
        }

        attributeChangedCallback(name, _, newValue) {
            let shadow = this.shadowRoot;
            let searchBarWrapper = shadow.getElementById("search-bar-wrapper");

            switch (name) {
                case "state":
                    searchBarWrapper.className =
                        "flex-container input-" + newValue;
                    break;
            }
        }

        #searchCancelHandler() {
            if (this.#abortController != null) this.#abortController.abort();
        }

        #searchNotFoundHandler() {
            const shadow = this.shadowRoot;
            const wrapper = shadow.getElementById("search-bar-wrapper");
            const notFoundPopupTemplate =
                shadow.getElementById("not-found-popup");
            const notFoundPopup = notFoundPopupTemplate.content.cloneNode(true);

            wrapper.appendChild(notFoundPopup);
        }

        #setUpSearchBar() {
            const shadow = this.shadowRoot;
            const barTextInput = shadow.getElementById("search-bar-input");

            barTextInput.addEventListener("keypress", (event) => {
                if (event.key === "Enter") {
                    this.#searchHandler();
                }
            });
        }

        #searchHandler() {
            const shadow = this.shadowRoot;
            const barTextInput = shadow.getElementById("search-bar-input");
            const currentEP = getVarState("currentEndpoint");

            const searchUrls = currentEP
                .getSearchUrls(barTextInput.value.toLowerCase())
                .flat();
            const searchInput = barTextInput.value;

            const dataFetch = this.#fetchSearchData(searchUrls);

            this.#setSearchBarLoading();

            this.#searchSubmitEvent = new CustomEvent("search", {
                detail: { fetch: dataFetch, input: searchInput },
            });
            document.dispatchEvent(this.#searchSubmitEvent);

            dataFetch.finally(() => {
                this.#resetSearchBar();
            });
        }

        #fetchSearchData(searchUrls) {
            let dataFetchList = [];

            this.#abortController = new AbortController();
            const abortSignal = this.#abortController.signal;

            searchUrls.forEach((url) => {
                dataFetchList.push(
                    fetch(url.url, { signal: abortSignal })
                        .then((response) => {
                            if (!response.ok) throw new Error("Server error");

                            return response.json();
                        })
                        .then((result) => {
                            return {
                                resultData: result,
                                endpoint: this.#getResultEndpoint(
                                    result,
                                    url.parent
                                ),
                            };
                        })
                        .catch((e) => {
                            if (e.message.includes("abort")) {
                                this.#resetSearchBar();
                                return { aborted: true };
                            }
                        })
                );
            });

            return Promise.all(dataFetchList);
        }

        #getResultEndpoint(result, parentEP) {
            switch (getVarState("currentAPI").name) {
                case "Pokémon API":
                    let sprite = getPokeEPSprite(
                        result,
                        parentEP.name,
                        parentEP.spriteUrl
                    );
                    return new PokeAPIEndpoint(
                        result.name,
                        sprite,
                        parentEP,
                        "",
                        parentEP.api
                    );
                case "Star Wars API":
                    let item = result.count > 0 ? result.results[0] : "";
                    return new SWAPIEndpoint(
                        item.name !== undefined ? item.name : item.title,
                        parentEP.spriteUrl,
                        parentEP,
                        "",
                        parentEP.api
                    );
            }
        }

        #setSearchBarLoading() {
            this.#disableSearchBar();
            this.#setLoader(true);
        }

        #resetSearchBar() {
            this.#clearSearchBar();
            this.#setLoader(false);
            this.#enableSearchBar();
        }

        #clearSearchBar() {
            const shadow = this.shadowRoot;
            const barTextInput = shadow.getElementById("search-bar-input");

            barTextInput.value = "";
        }

        #enableSearchBar() {
            const shadow = this.shadowRoot;
            const barTextInput = shadow.getElementById("search-bar-input");

            barTextInput.removeAttribute("disabled");
        }

        #disableSearchBar() {
            const shadow = this.shadowRoot;
            const barTextInput = shadow.getElementById("search-bar-input");

            barTextInput.setAttribute("disabled", true);
        }

        #setLoader(loading = false) {
            const shadow = this.shadowRoot;
            const searchLoader = shadow.getElementById("search-loader");

            searchLoader.style = loading ? "opacity: 1;" : "opacity: 0;";
        }
    }

    customElements.define("search-bar", SearchBar);
}
