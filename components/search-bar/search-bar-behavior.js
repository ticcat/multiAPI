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
        #searchSubmit;

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

        #setUpSearchBar() {
            const shadow = this.shadowRoot;
            const barTextInput = shadow.getElementById("search-bar-input");

            barTextInput.addEventListener("keypress", (event) => {
                if (event.key === "Enter") {
                    const currentEP = getVarState("currentEndpoint");
                    const searchInfo = currentEP
                        .getSearchUrls(barTextInput.value.toLowerCase())
                        .flat();
                    const dataFetch = this.#fetchSearchData(searchInfo);

                    this.#disableSearchBar();
                    this.#setLoader(true);

                    this.#searchSubmit = new CustomEvent("search", {
                        detail: dataFetch,
                    });
                    document.dispatchEvent(this.#searchSubmit);

                    dataFetch.finally(() => {
                        barTextInput.value = "";
                        this.#enableSearchBar();
                        this.#setLoader(false);
                    });
                }
            });
        }

        #fetchSearchData(searchInfo) {
            let dataFetchList = [];

            searchInfo.forEach((info) => {
                dataFetchList.push(
                    fetch(info.url)
                        .then((response) => {
                            if (!response.ok)
                                throw new Error("Entry not found");

                            return response.json();
                        })
                        .then((result) => {
                            return {
                                resultData: result,
                                endpoint: this.#getResultEndpoint(
                                    result,
                                    info.parent
                                ),
                            };
                        })
                        .catch(() => {})
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

        #disableSearchBar() {
            const shadow = this.shadowRoot;
            const barTextInput = shadow.getElementById("search-bar-input");

            barTextInput.setAttribute("disabled", true);
        }

        #enableSearchBar() {
            const shadow = this.shadowRoot;
            const barTextInput = shadow.getElementById("search-bar-input");

            barTextInput.removeAttribute("disabled");
        }

        #setLoader(loading = false) {
            const shadow = this.shadowRoot;
            const searchLoader = shadow.getElementById("search-loader");

            document.body.style.cursor = loading ? "wait" : "default";
            document.body.style.pointerEvents = loading ? "none" : "all";
            searchLoader.style = loading ? "opacity: 1;" : "opacity: 0;";
        }
    }

    customElements.define("search-bar", SearchBar);
}
